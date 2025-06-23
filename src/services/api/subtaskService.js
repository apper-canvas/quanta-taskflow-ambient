const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const subtaskService = {
  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "description" } },
          { field: { Name: "completed" } },
          { field: { Name: "task_id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('subtask', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching subtasks:', error);
      throw error;
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "description" } },
          { field: { Name: "completed" } },
          { field: { Name: "task_id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.getRecordById('subtask', parseInt(id, 10), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching subtask:', error);
      throw error;
    }
  },

  async create(subtaskData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          description: subtaskData.description,
          completed: subtaskData.completed || false,
          task_id: parseInt(subtaskData.taskId, 10)
        }]
      };

      const response = await apperClient.createRecord('subtask', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to create subtask');
        }
      }

      throw new Error('No result returned from create operation');
    } catch (error) {
      console.error('Error creating subtask:', error);
      throw error;
    }
  },

  async update(id, updates) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateData = {
        Id: parseInt(id, 10)
      };

      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.taskId !== undefined) updateData.task_id = parseInt(updates.taskId, 10);

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('subtask', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to update subtask');
        }
      }

      throw new Error('No result returned from update operation');
    } catch (error) {
      console.error('Error updating subtask:', error);
      throw error;
    }
  },

  async delete(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('subtask', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return { Id: parseInt(id, 10) };
        } else {
          throw new Error(result.message || 'Failed to delete subtask');
        }
      }

      return { Id: parseInt(id, 10) };
    } catch (error) {
      console.error('Error deleting subtask:', error);
      throw error;
    }
  },

  async getByTaskId(taskId) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "description" } },
          { field: { Name: "completed" } },
          { field: { Name: "task_id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        where: [
          { FieldName: "task_id", Operator: "EqualTo", Values: [parseInt(taskId, 10)] }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('subtask', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching subtasks by task:', error);
      throw error;
    }
  },

  async toggleComplete(id) {
    await delay(200);
    try {
      // First get current subtask
      const subtask = await this.getById(id);
      
      // Update with opposite completion status
      return await this.update(id, { completed: !subtask.completed });
    } catch (error) {
      console.error('Error toggling subtask completion:', error);
      throw error;
    }
  }
};

export default subtaskService;