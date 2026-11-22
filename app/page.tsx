"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check,
  ChevronDown, ChevronRight, CircleHelp, Clock3, Command, Filter,
  FolderKanban, LayoutDashboard, ListTodo, MoreHorizontal, Plus,
  Search, Settings2, SlidersHorizontal, Sparkles, Users, X, Zap,
  Menu, CheckCircle2
} from "lucide-react";

type Status = "Todo" | "In progress" | "In review" | "Done";
type Priority = "Urgent" | "High" | "Medium" | "Low";
type Task = {
  id: number; title: string; project: string; status: Status;
  priority: Priority; due: string; owner: string; initials: string;
  color: string; tag: string;
};

const initialTasks: Task[] = [
  { id: 1, title: "Map the onboarding journey", project: "Website redesign", status: "Todo", priority: "High", due: "Nov 24", owner: "Maya Chen", initials: "MC", color: "bg-violet-100 text-violet-700", tag: "Product" },
  { id: 2, title: "Review analytics events", project: "Mobile app", status: "Todo", priority: "Medium", due: "Nov 26", owner: "Noah Williams", initials: "NW", color: "bg-sky-100 text-sky-700", tag: "Research" },
  { id: 3, title: "Prepare component library", project: "Website redesign", status: "In progress", priority: "Urgent", due: "Nov 23", owner: "Ava Patel", initials: "AP", color: "bg-rose-100 text-rose-700", tag: "Design" },
  { id: 4, title: "Connect the sign-in flow", project: "Mobile app", status: "In progress", priority: "High", due: "Nov 27", owner: "Ethan Brooks", initials: "EB", color: "bg-amber-100 text-amber-700", tag: "Engineering" },
  { id: 5, title: "Validate empty states", project: "Website redesign", status: "In review", priority: "Medium", due: "Nov 25", owner: "Maya Chen", initials: "MC", color: "bg-violet-100 text-violet-700", tag: "Product" },
  { id: 6, title: "Write release notes", project: "Mobile app", status: "Done", priority: "Low", due: "Nov 20", owner: "Noah Williams", initials: "NW", color: "bg-sky-100 text-sky-700", tag: "Content" },
  { id: 7, title: "Audit responsive layouts", project: "Website redesign", status: "Done", priority: "High", due: "Nov 19", owner: "Ava Patel", initials: "AP", color: "bg-rose-100 text-rose-700", tag: "Design" }
];

const columns: Status[] = ["Todo", "In progress", "In review", "Done"];
const priorityStyles: Record<Priority, string> = {
  Urgent: "bg-rose-50 text-rose-700 ring-rose-100",
  High: "bg-orange-50 text-orange-700 ring-orange-100",
  Medium: "bg-blue-50 text-blue-700 ring-blue-100",
  Low: "bg-slate-100 text-slate-600 ring-slate-200"
};
const members = [
  { name: "Maya Chen", initials: "MC", color: "bg-violet-100 text-violet-700" },
  { name: "Noah Williams", initials: "NW", color: "bg-sky-100 text-sky-700" },
  { name: "Ava Patel", initials: "AP", color: "bg-rose-100 text-rose-700" },
  { name: "Ethan Brooks", initials: "EB", color: "bg-amber-100 text-amber-700" }
];

function Logo() {
  return <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#246b54] text-white shadow-sm"><Command size={19} strokeWidth={2.5} /></div>;
}
function Avatar({ initials, color }: { initials: string; color: string }) {
  return <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white ${color}`}>{initials}</div>;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [activeProject, setActiveProject] = useState("All tasks");
  const [activeNav, setActiveNav] = useState("Overview");
  const [showModal, setShowModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProject, setNewProject] = useState("Website redesign");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [newDue, setNewDue] = useState("Nov 29");
  const [newOwner, setNewOwner] = useState("Maya Chen");

  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesQuery = (task.title + " " + task.project + " " + task.owner).toLowerCase().includes(query.toLowerCase());
    const matchesProject = activeProject === "All tasks" || task.project === activeProject;
    return matchesQuery && matchesProject;
  }), [tasks, query, activeProject]);

  const done = tasks.filter(task => task.status === "Done").length;
  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const person = members.find(member => member.name === newOwner) ?? members[0];
    setTasks(current => [{
      id: Math.max(0, ...current.map(task => task.id)) + 1,
      title: newTitle.trim(), project: newProject, status: "Todo",
      priority: newPriority, due: newDue, owner: person.name,
      initials: person.initials, color: person.color, tag: "New task"
    }, ...current]);
    setNewTitle("");
    setShowModal(false);
  }

  function moveTask(id: number, status: Status) {
    setTasks(current => current.map(task => task.id === id ? { ...task, status } : task));
  }

  const nav = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "My tasks", icon: ListTodo },
    { label: "Projects", icon: FolderKanban },
    { label: "Team", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#17211f]">
      <div className="flex min-h-screen">
        <aside className={`${mobileMenu ? "fixed inset-y-0 left-0 z-40 flex" : "hidden"} w-[250px] shrink-0 flex-col border-r border-[#e8ece8] bg-white px-5 py-6 md:relative md:flex`}>
          <div className="flex items-center gap-3 px-1">
            <Logo />
            <div><div className="text-[17px] font-bold tracking-tight">devtrack</div><div className="text-[10px] font-medium tracking-[.16em] text-[#8a9690]">WORKSPACE</div></div>
            <button onClick={() => setMobileMenu(false)} className="ml-auto rounded-lg p-2 text-slate-400 md:hidden" aria-label="Close menu"><X size={18}/></button>
          </div>

          <button className="mt-9 flex items-center gap-3 rounded-xl border border-[#e8ece8] px-3 py-3 text-left shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f3ec] text-[#246b54]"><Command size={16}/></div>
            <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">Studio workspace</div><div className="text-[11px] text-[#8a9690]">Free plan</div></div>
            <ChevronDown size={15} className="text-slate-400"/>
          </button>

          <div className="mt-8 px-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#9aa49e]">Workspace</div>
          <nav className="mt-3 space-y-1">
            {nav.map(item => {
              const Icon = item.icon;
              return <button key={item.label} onClick={() => { setActiveNav(item.label); setMobileMenu(false); }} className={`nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium ${activeNav === item.label ? "bg-[#eaf4ee] text-[#246b54]" : "text-[#66716b]"}`}>
                <Icon size={17}/>{item.label}{item.label === "My tasks" && <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] text-[#7a8580]">4</span>}
              </button>;
            })}
          </nav>

          <div className="mt-9 flex items-center justify-between px-2"><div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9aa49e]">Your projects</div><button onClick={() => setShowModal(true)} className="rounded-md p-1 text-[#8a9690] hover:bg-slate-100" aria-label="Add project"><Plus size={15}/></button></div>
          <div className="mt-3 space-y-1">
            {[
              { name: "All tasks", dot: "bg-[#246b54]" },
              { name: "Website redesign", dot: "bg-violet-400" },
              { name: "Mobile app", dot: "bg-sky-400" }
            ].map(project => <button key={project.name} onClick={() => { setActiveProject(project.name); setActiveNav("Projects"); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] ${activeProject === project.name ? "bg-[#f3f6f3] font-semibold text-[#26332d]" : "text-[#77817b] hover:bg-slate-50"}`}><span className={`h-2 w-2 rounded-full ${project.dot}`}/>{project.name}</button>)}
          </div>

          <div className="mt-auto rounded-2xl bg-[#f2f7f3] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#246b54] shadow-sm"><Sparkles size={16}/></div>
            <div className="mt-3 text-xs font-semibold">Make work flow</div>
            <p className="mt-1 text-[11px] leading-5 text-[#77817b]">Keep the team aligned and move projects forward, one task at a time.</p>
            <button className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#246b54]">Explore workspace <ChevronRight size={13}/></button>
          </div>
          <button className="mt-5 flex items-center gap-3 border-t border-[#edf0ed] pt-5 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dcebe2] text-[10px] font-bold text-[#315b46]">KM</div>
            <div className="flex-1"><div className="text-xs font-semibold">Kamlesh</div><div className="text-[10px] text-[#8a9690]">Personal workspace</div></div>
            <MoreHorizontal size={17} className="text-slate-400"/>
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e8ece8] bg-white/90 px-5 backdrop-blur md:px-9">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenu(true)} className="rounded-lg p-2 text-[#68736d] hover:bg-slate-100 md:hidden" aria-label="Open menu"><Menu size={18}/></button>
              <div className="hidden items-center gap-2 text-xs text-[#98a19b] sm:flex"><span>Workspace</span><ChevronRight size={13}/><span className="font-semibold text-[#3f4b44]">{activeNav}</span></div>
              <div className="sm:hidden text-sm font-semibold">{activeNav}</div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative hidden sm:block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa49e]"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search anything..." className="h-9 w-48 rounded-xl border border-[#e8ece8] bg-[#fafbfa] pl-9 pr-3 text-xs outline-none placeholder:text-[#a1aaa4] focus:border-[#9bc7ae] lg:w-60"/></div>
              <button className="relative rounded-xl p-2 text-[#7c8781] hover:bg-slate-100" aria-label="Notifications"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e58a5b]"/></button>
              <button className="rounded-xl p-2 text-[#7c8781] hover:bg-slate-100" aria-label="Settings"><Settings2 size={17}/></button>
              <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#dcebe2] text-[10px] font-bold text-[#315b46]">KM</div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.15em] text-[#8c9891]"><span className="h-1.5 w-1.5 rounded-full bg-[#4d9b73]"/> Monday, November 23, 2026</div>
                <h1 className="mt-3 text-[28px] font-bold tracking-[-.04em] text-[#19241f] md:text-[34px]">Good morning, Kamlesh <span className="inline-block origin-bottom-right animate-pulse">✳</span></h1>
                <p className="mt-2 text-sm text-[#87918b]">Here’s what’s happening across your workspace today.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex h-10 items-center gap-2 rounded-xl border border-[#e3e9e4] bg-white px-3 text-xs font-semibold text-[#65716a] shadow-sm"><CalendarDays size={15}/> This week <ChevronDown size={13}/></button>
                <button onClick={() => setShowModal(true)} className="flex h-10 items-center gap-2 rounded-xl bg-[#246b54] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#1d5a46]"><Plus size={15}/> New task</button>
              </div>
            </div>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total tasks", value: tasks.length.toString(), note: "Across your projects", icon: ListTodo, accent: "bg-[#e9f3ed] text-[#35785a]", trend: "+12%" },
                { label: "Completed", value: done.toString(), note: "Tasks shipped so far", icon: CheckCircle2, accent: "bg-[#edf2fb] text-[#617eb5]", trend: "+8%" },
                { label: "In progress", value: tasks.filter(t => t.status === "In progress").length.toString(), note: "Currently being worked on", icon: Activity, accent: "bg-[#fff3e9] text-[#c17c45]", trend: "Active" },
                { label: "Team members", value: "4", note: "Collaborating this week", icon: Users, accent: "bg-[#f2edfa] text-[#8c70b2]", trend: "Online" }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return <div key={stat.label} className="rounded-2xl border border-[#e8ece8] bg-white p-5 shadow-soft">
                  <div className="flex items-center justify-between"><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.accent}`}><Icon size={17}/></div><span className="flex items-center gap-1 rounded-full bg-[#f0f7f2] px-2 py-1 text-[10px] font-semibold text-[#4d8d68]">{index < 2 ? <ArrowUpRight size={12}/> : <CircleHelp size={12}/>} {stat.trend}</span></div>
                  <div className="mt-5 text-[26px] font-bold tracking-tight">{stat.value}</div><div className="mt-1 text-xs font-semibold text-[#59655e]">{stat.label}</div><div className="mt-1 text-[11px] text-[#9aa49e]">{stat.note}</div>
                </div>;
              })}
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
              <div className="rounded-2xl border border-[#e8ece8] bg-white p-5 shadow-soft md:p-6">
                <div className="flex items-center justify-between"><div><div className="text-sm font-bold">Project progress</div><div className="mt-1 text-[11px] text-[#929c96]">A quick look at delivery across your workspace</div></div><button className="rounded-lg p-2 text-[#89948d] hover:bg-slate-50"><MoreHorizontal size={18}/></button></div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div><div className="flex items-end gap-2"><div className="text-[32px] font-bold tracking-tight">{progress}%</div><div className="mb-1 text-[11px] text-[#8e9992]">overall completion</div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf1ed]"><div className="h-full rounded-full bg-[#3c8a65]" style={{ width: `${progress}%` }}/></div><div className="mt-2 flex justify-between text-[10px] text-[#9aa49e]"><span>{done} completed</span><span>{tasks.length - done} remaining</span></div></div>
                  <div className="space-y-3">
                    {[{name:"Website redesign",value:68,color:"bg-[#8a78b8]"},{name:"Mobile app",value:42,color:"bg-[#5a98b5]"}].map(project => <div key={project.name}><div className="mb-1.5 flex justify-between text-[11px]"><span className="font-semibold text-[#526057]">{project.name}</span><span className="text-[#8e9992]">{project.value}%</span></div><div className="h-1.5 rounded-full bg-[#edf1ed]"><div className={`h-full rounded-full ${project.color}`} style={{width:`${project.value}%`}}/></div></div>)}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[#e8ece8] bg-white p-5 shadow-soft md:p-6">
                <div className="flex items-center justify-between"><div><div className="text-sm font-bold">Team activity</div><div className="mt-1 text-[11px] text-[#929c96]">Your core collaborators</div></div><button className="text-[11px] font-semibold text-[#34785a]">View team</button></div>
                <div className="mt-5 space-y-4">{members.map((member,index)=><div key={member.name} className="flex items-center gap-3"><Avatar initials={member.initials} color={member.color}/><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{member.name}</div><div className="text-[10px] text-[#9aa49e]">{["Product design","Engineering","UI / UX","Development"][index]}</div></div><span className={`h-2 w-2 rounded-full ${index === 3 ? "bg-amber-400" : "bg-[#55a777]"}`}/><span className="text-[10px] text-[#98a29c]">{index === 3 ? "Away" : "Online"}</span></div>)}</div>
              </div>
            </section>

            <section className="mt-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div><div className="text-[18px] font-bold tracking-tight">Task board</div><div className="mt-1 text-[11px] text-[#929c96]">Plan, prioritize, and keep good work moving.</div></div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="relative sm:hidden"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa49e]"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search tasks..." className="h-9 w-36 rounded-xl border border-[#e3e9e4] bg-white pl-8 pr-2 text-xs outline-none"/></label>
                  <select value={activeProject} onChange={event=>setActiveProject(event.target.value)} className="h-9 rounded-xl border border-[#e3e9e4] bg-white px-3 text-[11px] font-semibold text-[#65716a] outline-none"><option>All tasks</option><option>Website redesign</option><option>Mobile app</option></select>
                  <button className="flex h-9 items-center gap-2 rounded-xl border border-[#e3e9e4] bg-white px-3 text-[11px] font-semibold text-[#65716a]"><SlidersHorizontal size={14}/> Filter</button>
                  <button onClick={() => setShowModal(true)} className="flex h-9 items-center gap-2 rounded-xl border border-[#e3e9e4] bg-white px-3 text-[11px] font-semibold text-[#65716a]"><Plus size={14}/> Add task</button>
                </div>
              </div>

              <div className="board-scroll mt-5 grid min-w-0 gap-4 overflow-x-auto pb-3 md:grid-cols-2 xl:grid-cols-4">
                {columns.map((column,index)=>{
                  const columnTasks = visibleTasks.filter(task=>task.status===column);
                  return <div key={column} className="min-w-[250px] rounded-2xl border border-[#e7ece7] bg-[#f0f3f0] p-3">
                    <div className="flex items-center justify-between px-1 py-2"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${["bg-slate-400","bg-blue-400","bg-violet-400","bg-emerald-500"][index]}`}/><span className="text-xs font-bold">{column}</span><span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#849088]">{columnTasks.length}</span></div><button className="rounded-md p-1 text-[#98a29c] hover:bg-white"><MoreHorizontal size={16}/></button></div>
                    <div className="mt-2 space-y-3">
                      {columnTasks.map(task=><article key={task.id} className="task-card rounded-xl border border-[#e9ede9] bg-white p-3.5 shadow-[0_2px_8px_rgba(24,43,35,.025)]">
                        <div className="flex items-start justify-between gap-2"><span className="rounded-md bg-[#f3f6f3] px-2 py-1 text-[9px] font-semibold text-[#738078]">{task.tag}</span><button className="text-[#a4ada7] hover:text-[#4c5b52]" aria-label="Task options"><MoreHorizontal size={15}/></button></div>
                        <h3 className="mt-3 text-[12px] font-semibold leading-5 text-[#29352e]">{task.title}</h3>
                        <div className="mt-2 text-[10px] text-[#a0aaa3]">{task.project}</div>
                        <div className="mt-3 flex items-center justify-between"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ring-1 ring-inset ${priorityStyles[task.priority]}`}>{task.priority}</span><div className="flex items-center gap-1 text-[10px] text-[#929c96]"><CalendarDays size={12}/>{task.due}</div></div>
                        <div className="mt-3 flex items-center justify-between border-t border-[#f0f2f0] pt-3"><div className="flex items-center gap-2"><Avatar initials={task.initials} color={task.color}/><span className="text-[10px] text-[#748078]">{task.owner.split(" ")[0]}</span></div><select aria-label={`Move ${task.title}`} value={task.status} onChange={event=>moveTask(task.id,event.target.value as Status)} className="max-w-[105px] rounded-md border-0 bg-[#f7f9f7] px-1.5 py-1 text-[9px] text-[#718078] outline-none"><option>Todo</option><option>In progress</option><option>In review</option><option>Done</option></select></div>
                      </article>)}
                      {columnTasks.length===0 && <div className="rounded-xl border border-dashed border-[#d9e1da] px-3 py-7 text-center text-[10px] text-[#a0aaa3]">No tasks here yet</div>}
                    </div>
                    <button onClick={()=>{setShowModal(true);}} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-semibold text-[#87938b] hover:bg-white hover:text-[#246b54]"><Plus size={13}/> Add a task</button>
                  </div>;
                })}
              </div>
            </section>

            <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[#e6ebe6] py-5 text-[10px] text-[#9aa49e] sm:flex-row"><span>© 2026 DevTrack. Thoughtful work starts here.</span><span className="flex items-center gap-3"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#60a579]"/> All systems operational</span><span>Made for focused teams</span></span></footer>
          </div>
        </main>
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14231c]/35 p-4 backdrop-blur-[2px]" onMouseDown={event=>{if(event.target===event.currentTarget)setShowModal(false);}}>
        <form onSubmit={addTask} className="w-full max-w-md rounded-2xl border border-[#e7ece7] bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between"><div><div className="text-lg font-bold">Create a task</div><div className="mt-1 text-xs text-[#8a9690]">Add a clear next step to your board.</div></div><button type="button" onClick={()=>setShowModal(false)} className="rounded-lg p-2 text-[#8a9690] hover:bg-slate-100" aria-label="Close"><X size={17}/></button></div>
          <label className="mt-5 block text-[11px] font-semibold text-[#526057]">Task name<input required autoFocus value={newTitle} onChange={event=>setNewTitle(event.target.value)} placeholder="e.g. Prepare project brief" className="mt-2 h-10 w-full rounded-xl border border-[#e3e9e4] px-3 text-xs outline-none focus:border-[#8ab99b]"/></label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-[11px] font-semibold text-[#526057]">Project<select value={newProject} onChange={event=>setNewProject(event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-[#e3e9e4] bg-white px-2 text-xs outline-none"><option>Website redesign</option><option>Mobile app</option></select></label>
            <label className="text-[11px] font-semibold text-[#526057]">Priority<select value={newPriority} onChange={event=>setNewPriority(event.target.value as Priority)} className="mt-2 h-10 w-full rounded-xl border border-[#e3e9e4] bg-white px-2 text-xs outline-none"><option>Urgent</option><option>High</option><option>Medium</option><option>Low</option></select></label>
            <label className="text-[11px] font-semibold text-[#526057]">Due date<input value={newDue} onChange={event=>setNewDue(event.target.value)} placeholder="Nov 29" className="mt-2 h-10 w-full rounded-xl border border-[#e3e9e4] px-3 text-xs outline-none"/></label>
            <label className="text-[11px] font-semibold text-[#526057]">Assignee<select value={newOwner} onChange={event=>setNewOwner(event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-[#e3e9e4] bg-white px-2 text-xs outline-none">{members.map(member=><option key={member.name}>{member.name}</option>)}</select></label>
          </div>
          <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setShowModal(false)} className="h-10 rounded-xl border border-[#e3e9e4] px-4 text-xs font-semibold text-[#68746c]">Cancel</button><button type="submit" className="h-10 rounded-xl bg-[#246b54] px-4 text-xs font-semibold text-white hover:bg-[#1d5a46]">Create task</button></div>
        </form>
      </div>}
    </div>
  );
}