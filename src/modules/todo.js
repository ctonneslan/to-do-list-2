function createTodo({
  title,
  description = "",
  dueDate = "",
  priority = "low",
  notes = "",
  checklist = [],
}) {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist,
    completed: false,

    toggleComplete() {
      this.completed = !this.completed;
    },

    update(fields) {
      Object.assign(this, field);
    },
  };
}

export { createTodo };
