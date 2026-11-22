"""Shared demo records and project analytics for DevTrack."""

from __future__ import annotations

from collections import Counter
from typing import Any

STATUSES = ["Todo", "In progress", "In review", "Done"]
PRIORITIES = ["Urgent", "High", "Medium", "Low"]
PROJECTS = ["Website redesign", "Mobile app"]
TEAM_MEMBERS = [
    {"name": "Maya Chen", "initials": "MC", "team": "Product"},
    {"name": "Noah Williams", "initials": "NW", "team": "Research"},
    {"name": "Ava Patel", "initials": "AP", "team": "Design"},
    {"name": "Ethan Brooks", "initials": "EB", "team": "Engineering"},
]

INITIAL_TASKS: list[dict[str, Any]] = [
    {"id": 1, "title": "Map the onboarding journey", "project": "Website redesign", "status": "Todo", "priority": "High", "due": "Nov 24", "owner": "Maya Chen", "tag": "Product"},
    {"id": 2, "title": "Review analytics events", "project": "Mobile app", "status": "Todo", "priority": "Medium", "due": "Nov 26", "owner": "Noah Williams", "tag": "Research"},
    {"id": 3, "title": "Prepare component library", "project": "Website redesign", "status": "In progress", "priority": "Urgent", "due": "Nov 23", "owner": "Ava Patel", "tag": "Design"},
    {"id": 4, "title": "Connect the sign-in flow", "project": "Mobile app", "status": "In progress", "priority": "High", "due": "Nov 27", "owner": "Ethan Brooks", "tag": "Engineering"},
    {"id": 5, "title": "Validate empty states", "project": "Website redesign", "status": "In review", "priority": "Medium", "due": "Nov 25", "owner": "Maya Chen", "tag": "Product"},
    {"id": 6, "title": "Write release notes", "project": "Mobile app", "status": "Done", "priority": "Low", "due": "Nov 20", "owner": "Noah Williams", "tag": "Content"},
    {"id": 7, "title": "Audit responsive layouts", "project": "Website redesign", "status": "Done", "priority": "High", "due": "Nov 19", "owner": "Ava Patel", "tag": "Design"},
]

PROJECT_DETAILS = [
    {"name": "Website redesign", "description": "Refresh core journeys and establish a reusable component system.", "lead": "Maya Chen", "color": "Violet", "target": "Nov 30"},
    {"name": "Mobile app", "description": "Ship a clearer mobile experience with reliable sign-in and analytics.", "lead": "Ethan Brooks", "color": "Blue", "target": "Dec 12"},
]


def filter_tasks(
    tasks: list[dict[str, Any]],
    *,
    query: str = "",
    project: str = "All tasks",
    status: str = "All statuses",
    priority: str = "All priorities",
    owner: str = "All teammates",
) -> list[dict[str, Any]]:
    """Filter tasks by text, project, status, priority and assignee."""
    term = query.casefold().strip()
    output = []
    for task in tasks:
        searchable = " ".join(str(task.get(key, "")) for key in ("title", "project", "owner", "tag")).casefold()
        if term and term not in searchable:
            continue
        if project != "All tasks" and task.get("project") != project:
            continue
        if status != "All statuses" and task.get("status") != status:
            continue
        if priority != "All priorities" and task.get("priority") != priority:
            continue
        if owner != "All teammates" and task.get("owner") != owner:
            continue
        output.append(task)
    return output


def summarize_tasks(tasks: list[dict[str, Any]]) -> dict[str, Any]:
    """Return workspace totals and per-status counts."""
    counts = Counter(task.get("status", "Todo") for task in tasks)
    total = len(tasks)
    done = counts.get("Done", 0)
    return {
        "total": total,
        "done": done,
        "in_progress": counts.get("In progress", 0),
        "in_review": counts.get("In review", 0),
        "todo": counts.get("Todo", 0),
        "completion_percent": round(done / total * 100) if total else 0,
        "status_counts": {status: counts.get(status, 0) for status in STATUSES},
    }


def validate_task(
    title: str,
    project: str,
    priority: str,
    due: str,
    owner: str,
) -> tuple[bool, str]:
    """Validate required task fields and enum values."""
    if not title.strip():
        return False, "Task title is required."
    if project not in PROJECTS:
        return False, "Choose a valid project."
    if priority not in PRIORITIES:
        return False, "Choose a valid priority."
    if owner not in {member["name"] for member in TEAM_MEMBERS}:
        return False, "Choose a valid teammate."
    if not due.strip():
        return False, "A due date is required."
    return True, ""


def make_task(
    task_id: int,
    title: str,
    project: str,
    priority: str,
    due: str,
    owner: str,
    status: str = "Todo",
) -> dict[str, Any]:
    """Create one validated task record."""
    valid, message = validate_task(title, project, priority, due, owner)
    if not valid:
        raise ValueError(message)
    if status not in STATUSES:
        raise ValueError("Choose a valid task status.")
    return {
        "id": int(task_id),
        "title": title.strip(),
        "project": project,
        "status": status,
        "priority": priority,
        "due": due.strip(),
        "owner": owner,
        "tag": next(member["team"] for member in TEAM_MEMBERS if member["name"] == owner),
    }


def update_task_status(
    tasks: list[dict[str, Any]], task_id: int, new_status: str
) -> list[dict[str, Any]]:
    """Return a copied task list with one status changed."""
    if new_status not in STATUSES:
        raise ValueError("Choose a valid task status.")
    found = False
    updated = []
    for task in tasks:
        item = dict(task)
        if int(item["id"]) == int(task_id):
            item["status"] = new_status
            found = True
        updated.append(item)
    if not found:
        raise ValueError(f"Task {task_id} was not found.")
    return updated
