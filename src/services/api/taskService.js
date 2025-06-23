import taskData from '@/services/mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      categoryId: taskData.categoryId || 1,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1,
      ...taskData
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    // Don't allow Id modification
    const { Id, ...validUpdates } = updates;
    tasks[index] = { ...tasks[index], ...validUpdates };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async getByCategory(categoryId) {
    await delay(250);
    return tasks.filter(t => t.categoryId === parseInt(categoryId, 10)).map(t => ({ ...t }));
  },

  async getToday() {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate === today && !t.completed).map(t => ({ ...t }));
  },

  async getUpcoming() {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate && t.dueDate > today && !t.completed).map(t => ({ ...t }));
  },

  async getCompleted() {
    await delay(300);
    return tasks.filter(t => t.completed).map(t => ({ ...t }));
  },

  async toggleComplete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks[index].completed = !tasks[index].completed;
    return { ...tasks[index] };
  },

  async reorder(taskIds) {
    await delay(300);
    taskIds.forEach((id, index) => {
      const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10));
      if (taskIndex !== -1) {
        tasks[taskIndex].order = index + 1;
      }
    });
    return [...tasks];
  }
};

export default taskService;