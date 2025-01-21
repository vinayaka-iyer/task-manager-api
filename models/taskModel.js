// Task Schema
class Task {
	constructor(id, title, description, status, created_at, updated_at) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.status = status;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}

module.exports = Task;
