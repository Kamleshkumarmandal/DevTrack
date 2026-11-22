from __future__ import annotations

import io
from datetime import date, timedelta

import pandas as pd
import streamlit as st

from devtrack_engine import (
    INITIAL_TASKS,
    PRIORITIES,
    PROJECT_DETAILS,
    PROJECTS,
    STATUSES,
    TEAM_MEMBERS,
    filter_tasks,
    make_task,
    summarize_tasks,
    update_task_status,
)

st.set_page_config(
    page_title="DevTrack | Project Management & Team Collaboration",
    page_icon="📋",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
html,body,[class*="css"]{font-family:'DM Sans',sans-serif}
.stApp{background:#f6f8f6;color:#17241f}
[data-testid="stSidebar"]{background:#fff;border-right:1px solid #e7ece8}
.brand{font:800 25px Manrope;letter-spacing:-1.2px;color:#17241f;margin:4px 0 5px}
.brand span{color:#246b54}
.brand-sub{font-size:8px;letter-spacing:1.25px;font-weight:800;color:#98a39c;margin-bottom:22px}
.hero{background:linear-gradient(112deg,#193d32,#286b52);border-radius:16px;padding:25px 28px;color:#fff;margin:7px 0 17px}
.hero .eyebrow{color:#bce2ce;font-size:9px;font-weight:800;letter-spacing:1.7px;margin-bottom:10px}
.hero h1{font:800 30px Manrope;letter-spacing:-1.5px;color:#fff;margin:0 0 7px}
.hero p{font-size:12px;line-height:1.65;color:#d7e9df;max-width:750px;margin:0}
.section-title{font:800 19px Manrope;letter-spacing:-.4px;color:#202e27;margin:10px 0 3px}
.section-sub{font-size:10px;color:#89958d;margin-bottom:13px}
div[data-testid="stMetric"]{background:#fff;border:1px solid #e5ebe6;border-radius:11px;padding:13px 15px;box-shadow:0 3px 14px #172d2207}
div[data-testid="stMetricLabel"]{font-size:10px;color:#849188}
div[data-testid="stMetricValue"]{font:800 23px Manrope;color:#20352a}
.task-card{background:#fff;border:1px solid #e5ebe6;border-radius:11px;padding:12px 13px;margin:0 0 9px}
.task-card strong{font-size:12px;color:#26362d}
.muted{font-size:10px;color:#8b988f}
.pill{display:inline-block;padding:4px 7px;border-radius:15px;background:#edf5ef;color:#317052;font-size:9px;font-weight:700}
.priority-urgent{color:#c05252;background:#fff0ef;padding:4px 7px;border-radius:15px;font-size:9px;font-weight:700}
.priority-high{color:#b87633;background:#fff4e8;padding:4px 7px;border-radius:15px;font-size:9px;font-weight:700}
.priority-medium{color:#4f78ab;background:#eff5fc;padding:4px 7px;border-radius:15px;font-size:9px;font-weight:700}
.priority-low{color:#77847b;background:#f0f3f1;padding:4px 7px;border-radius:15px;font-size:9px;font-weight:700}
.insight{background:#eaf3ed;border:1px solid #dcebe1;border-radius:10px;padding:12px 15px;color:#32654a;font-size:11px;line-height:1.6;margin:10px 0 15px}
.smallcaps{font-size:8px;letter-spacing:1.1px;color:#9ba69e;font-weight:800}
.footer{font-size:9px;color:#9aa59d;text-align:center;padding:20px 0 8px}
.stButton>button{border-radius:8px;font-weight:600}
.stButton>button[kind="primary"]{background:#246b54;border-color:#246b54}
div[data-testid="stDataFrame"]{border:1px solid #e5ebe6;border-radius:10px;overflow:hidden}
hr{border-color:#e6ece7}
</style>
""", unsafe_allow_html=True)

if "tasks" not in st.session_state:
    st.session_state.tasks = [dict(task) for task in INITIAL_TASKS]
if "active_project" not in st.session_state:
    st.session_state.active_project = "All tasks"
if "notice" not in st.session_state:
    st.session_state.notice = ""

tasks = st.session_state.tasks
summary = summarize_tasks(tasks)

with st.sidebar:
    st.markdown('<div class="brand">dev<span>track</span></div>', unsafe_allow_html=True)
    st.markdown('<div class="brand-sub">PROJECT MANAGEMENT WORKSPACE</div>', unsafe_allow_html=True)
    page = st.radio("WORKSPACE", ["Overview", "Task board", "Projects", "Team"])
    st.divider()
    st.markdown("**PROJECT FILTER**")
    selected_project = st.selectbox("Choose a project", ["All tasks"] + PROJECTS, label_visibility="collapsed")
    st.session_state.active_project = selected_project
    st.divider()
    if st.button("＋ Create task", type="primary", use_container_width=True):
        st.session_state.open_task_form = True
    if st.button("↻ Reset sample workspace", use_container_width=True):
        st.session_state.tasks = [dict(task) for task in INITIAL_TASKS]
        st.session_state.active_project = "All tasks"
        st.rerun()
    st.caption("Sample workspace · Changes are stored in this session only.")

st.markdown('<div class="hero"><div class="eyebrow">PLAN · COLLABORATE · DELIVER</div><h1>Make great work flow.</h1><p>DevTrack brings projects, tasks and teammates together in one focused workspace. See what is moving, what needs attention and what your team has shipped.</p></div>', unsafe_allow_html=True)

if page in ("Overview", "Task board"):
    m1,m2,m3,m4=st.columns(4)
    m1.metric("Total tasks",summary["total"],"Across your projects")
    m2.metric("Completed",summary["done"],f"{summary['completion_percent']}% completion")
    m3.metric("In progress",summary["in_progress"],"Being worked on")
    m4.metric("In review",summary["in_review"],"Awaiting feedback")
    st.markdown(f'<div class="insight"><b>✳ Workspace pulse</b><br/>{summary["done"]} of {summary["total"]} tasks are complete. '
                f'{summary["todo"]} tasks are still to do and {summary["in_progress"]} are actively moving. Keep the next action clear for every owner.</div>',
                unsafe_allow_html=True)

    if page == "Overview":
        left,right=st.columns([1.45,1])
        with left:
            st.markdown('<div class="section-title">Project progress</div><div class="section-sub">Completion across the sample projects.</div>',unsafe_allow_html=True)
            project_rows=[]
            for project in PROJECT_DETAILS:
                related=[task for task in tasks if task["project"]==project["name"]]
                state=summarize_tasks(related)
                project_rows.append({"Project":project["name"],"Completed":state["done"],"Total tasks":state["total"],"Progress":state["completion_percent"]})
            st.dataframe(pd.DataFrame(project_rows),width="stretch",hide_index=True,
                column_config={"Progress":st.column_config.ProgressColumn("Progress",min_value=0,max_value=100,format="%d%%")})
            st.markdown('<div class="section-title">Work by status</div>',unsafe_allow_html=True)
            status_df=pd.DataFrame([{"Status":key,"Tasks":value} for key,value in summary["status_counts"].items()])
            st.bar_chart(status_df.set_index("Status"),color="#398465")
        with right:
            st.markdown('<div class="section-title">Priority overview</div>',unsafe_allow_html=True)
            counts=pd.Series([task["priority"] for task in tasks]).value_counts().reindex(PRIORITIES,fill_value=0)
            st.bar_chart(counts,color="#7c9d88")
            st.markdown('<div class="section-title">Team workload</div>',unsafe_allow_html=True)
            workload=pd.Series([task["owner"] for task in tasks]).value_counts()
            st.dataframe(workload.rename_axis("Teammate").reset_index(name="Assigned tasks"),width="stretch",hide_index=True)
        st.markdown('<div class="section-title">Recently updated tasks</div>',unsafe_allow_html=True)
        for task in tasks[:4]:
            st.markdown(f'<div class="task-card"><strong>{task["title"]}</strong><br/><span class="muted">{task["project"]} · {task["owner"]} · Due {task["due"]}</span></div>',unsafe_allow_html=True)

    else:
        st.markdown('<div class="section-title">Team Kanban board</div><div class="section-sub">Filter, inspect and move work through the delivery workflow.</div>',unsafe_allow_html=True)
        a,b,c=st.columns([1.4,1,1])
        query=a.text_input("Search tasks",placeholder="Search task or teammate",label_visibility="collapsed")
        priority=c.selectbox("Priority",["All priorities"]+PRIORITIES,label_visibility="collapsed")
        owner=b.selectbox("Assignee",["All teammates"]+[member["name"] for member in TEAM_MEMBERS],label_visibility="collapsed")
        visible=filter_tasks(tasks,query=query,project=selected_project,priority=priority,owner=owner)
        columns=st.columns(4)
        for index,status in enumerate(STATUSES):
            with columns[index]:
                column_tasks=[task for task in visible if task["status"]==status]
                st.markdown(f"**{status}** · {len(column_tasks)}")
                for task in column_tasks:
                    urgency=task["priority"].lower()
                    st.markdown(f'<div class="task-card"><strong>{task["title"]}</strong><br/><span class="muted">{task["project"]}</span><br/><br/><span class="priority-{urgency}">{task["priority"]}</span><br/><br/><span class="muted">◉ {task["owner"]}<br/>◷ Due {task["due"]}</span></div>',unsafe_allow_html=True)
                    choices=[s for s in STATUSES if s!=status]
                    new_status=st.selectbox("Move to",choices,key=f"move-{task['id']}",label_visibility="collapsed")
                    if st.button("Update status",key=f"update-{task['id']}",use_container_width=True):
                        st.session_state.tasks=update_task_status(st.session_state.tasks,task["id"],new_status)
                        st.rerun()
        with st.expander("Advanced task filters"):
            status_filter=st.selectbox("Status",["All statuses"]+STATUSES)
            filtered=filter_tasks(tasks,query=query,project=selected_project,status=status_filter,priority=priority,owner=owner)
            st.dataframe(pd.DataFrame(filtered),width="stretch",hide_index=True)

elif page=="Projects":
    st.markdown('<div class="section-title">Project portfolio</div><div class="section-sub">A single view of active workstreams, ownership and delivery progress.</div>',unsafe_allow_html=True)
    for project in PROJECT_DETAILS:
        related=[task for task in tasks if task["project"]==project["name"]]
        state=summarize_tasks(related)
        with st.container(border=True):
            a,b=st.columns([3,1])
            a.markdown(f"### {project['name']}")
            a.write(project["description"])
            a.caption(f"Project lead: {project['lead']} · Target: {project['target']}")
            b.metric("Progress",f"{state['completion_percent']}%")
            st.progress(state["completion_percent"]/100)
            x,y,z=st.columns(3)
            x.metric("Total tasks",state["total"])
            y.metric("Completed",state["done"])
            z.metric("In progress",state["in_progress"])
    st.markdown('<div class="section-title">All project tasks</div>',unsafe_allow_html=True)
    st.dataframe(pd.DataFrame(tasks),width="stretch",hide_index=True)

elif page=="Team":
    st.markdown('<div class="section-title">Meet the team</div><div class="section-sub">Workload and task ownership across the demo workspace.</div>',unsafe_allow_html=True)
    for member in TEAM_MEMBERS:
        owned=[task for task in tasks if task["owner"]==member["name"]]
        completed=sum(task["status"]=="Done" for task in owned)
        with st.container(border=True):
            a,b,c=st.columns([2,1,1])
            a.markdown(f"**{member['name']}**")
            a.caption(member["team"])
            b.metric("Assigned tasks",len(owned))
            c.metric("Completed",completed)
            if owned:
                st.progress(completed/len(owned),text=f"{round(completed/len(owned)*100)}% of assigned tasks complete")
            st.caption(" · ".join(task["title"] for task in owned) if owned else "No tasks assigned")

if st.session_state.get("open_task_form",False):
    st.markdown('<div class="section-title">Create a task</div>',unsafe_allow_html=True)
    with st.form("create_task_form",clear_on_submit=True):
        title=st.text_input("Task title")
        a,b=st.columns(2)
        project=a.selectbox("Project",PROJECTS)
        priority=b.selectbox("Priority",PRIORITIES,index=2)
        c,d=st.columns(2)
        owner=c.selectbox("Assignee",[member["name"] for member in TEAM_MEMBERS])
        due=d.date_input("Due date",value=date.today()+timedelta(days=7))
        submitted=st.form_submit_button("Create task",type="primary")
        if submitted:
            valid,message=__import__("devtrack_engine").validate_task(title,project,priority,due.strftime("%b %d"),owner)
            if not valid:
                st.error(message)
            else:
                new_task=make_task(max([int(item["id"]) for item in st.session_state.tasks]+[0])+1,title,project,priority,due.strftime("%b %d"),owner)
                st.session_state.tasks.insert(0,new_task)
                st.session_state.open_task_form=False
                st.success("Task created in this demo session.")
                st.rerun()
    if st.button("Cancel"):
        st.session_state.open_task_form=False
        st.rerun()

st.divider()
buffer=io.StringIO()
pd.DataFrame(st.session_state.tasks).to_csv(buffer,index=False)
st.download_button("⬇ Download task report (CSV)",buffer.getvalue(),"devtrack-task-report.csv","text/csv")
st.markdown('<div class="smallcaps">DEVTRACK · PROJECT MANAGEMENT & TEAM COLLABORATION</div><div class="footer">Independent portfolio demo · Sample workspace data · Changes reset when the session restarts.</div>',unsafe_allow_html=True)
