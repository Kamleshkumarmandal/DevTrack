import unittest

from devtrack_engine import (
    INITIAL_TASKS,
    PROJECTS,
    PRIORITIES,
    STATUSES,
    TEAM_MEMBERS,
    filter_tasks,
    make_task,
    summarize_tasks,
    update_task_status,
    validate_task,
)


class DevTrackEngineTests(unittest.TestCase):
    def test_summary_counts_and_completion(self):
        summary = summarize_tasks(INITIAL_TASKS)
        self.assertEqual(summary["total"], 7)
        self.assertEqual(summary["done"], 2)
        self.assertEqual(summary["completion_percent"], 29)
        self.assertEqual(sum(summary["status_counts"].values()), 7)

    def test_filter_by_project_and_status(self):
        filtered = filter_tasks(INITIAL_TASKS, project="Website redesign", status="Done")
        self.assertEqual(len(filtered), 1)
        self.assertEqual(filtered[0]["title"], "Audit responsive layouts")

    def test_search_by_owner_and_task_name(self):
        by_owner = filter_tasks(INITIAL_TASKS, query="Maya Chen")
        by_title = filter_tasks(INITIAL_TASKS, query="sign-in flow")
        self.assertEqual(len(by_owner), 2)
        self.assertEqual(by_title[0]["id"], 4)

    def test_filter_by_priority_and_assignee(self):
        filtered = filter_tasks(INITIAL_TASKS, priority="Urgent", owner="Ava Patel")
        self.assertEqual([task["id"] for task in filtered], [3])

    def test_validate_task_fields_and_enums(self):
        valid, _ = validate_task("Ship onboarding", PROJECTS[0], PRIORITIES[1], "Dec 01", TEAM_MEMBERS[0]["name"])
        self.assertTrue(valid)
        valid, message = validate_task("", PROJECTS[0], PRIORITIES[1], "Dec 01", TEAM_MEMBERS[0]["name"])
        self.assertFalse(valid)
        self.assertIn("title", message)

    def test_make_task(self):
        task = make_task(99, "Ship dashboard", PROJECTS[1], PRIORITIES[0], "Dec 02", TEAM_MEMBERS[3]["name"])
        self.assertEqual(task["id"], 99)
        self.assertEqual(task["status"], "Todo")
        self.assertEqual(task["tag"], "Engineering")

    def test_update_task_status_returns_updated_copy(self):
        updated = update_task_status(INITIAL_TASKS, 1, "In progress")
        self.assertEqual(updated[0]["status"], "In progress")
        self.assertEqual(INITIAL_TASKS[0]["status"], "Todo")

    def test_update_rejects_invalid_status_and_unknown_task(self):
        with self.assertRaises(ValueError):
            update_task_status(INITIAL_TASKS, 1, "Blocked")
        with self.assertRaisesRegex(ValueError, "not found"):
            update_task_status(INITIAL_TASKS, 999, STATUSES[0])


if __name__ == "__main__":
    unittest.main()
