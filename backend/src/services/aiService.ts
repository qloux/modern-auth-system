interface TaskPatterns {
  overdueTasks: any[];
  upcomingDeadlines: any[];
  completedTasks: any[];
  tasksByPriority: {
    high: any[];
    medium: any[];
    low: any[];
  };
  averageCompletionTime: number;
}

export const analyzeTaskPatterns = async (tasks: any[]): Promise<TaskPatterns> => {
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  );
  
  const upcomingDeadlines = tasks.filter(task =>
    task.dueDate && 
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
  );

  const completedTasks = tasks.filter(task => task.completed);
  
  const tasksByPriority = {
    high: tasks.filter(task => task.priority === 'high'),
    medium: tasks.filter(task => task.priority === 'medium'),
    low: tasks.filter(task => task.priority === 'low'),
  };

  const averageCompletionTime = completedTasks.length > 0
    ? completedTasks.reduce((acc, task) => acc + (task.actualTime || 0), 0) / completedTasks.length
    : 0;

  return {
    overdueTasks,
    upcomingDeadlines,
    completedTasks,
    tasksByPriority,
    averageCompletionTime,
  };
};

export const generateRecommendations = async (patterns: TaskPatterns) => {
  const totalTasks = patterns.tasksByPriority.high.length + 
                     patterns.tasksByPriority.medium.length + 
                     patterns.tasksByPriority.low.length;
                     
  const completionRate = totalTasks > 0 
    ? (patterns.completedTasks.length / totalTasks) * 100 
    : 0;

  // Generate priority recommendations
  const priorityRecommendations = {
    overdueTasksCount: patterns.overdueTasks.length,
    urgentTasks: patterns.upcomingDeadlines.map(task => ({
      id: task._id,
      title: task.title,
      dueDate: task.dueDate,
    })),
    recommendation: getPriorityRecommendation(patterns),
  };

  // Generate time management tips
  const timeManagementTips = {
    averageTaskCompletionTime: Math.round(patterns.averageCompletionTime),
    tips: getTimeManagementTips(patterns),
  };

  // Generate productivity insights
  const productivityInsights = {
    completionRate: Math.round(completionRate),
    taskDistribution: {
      high: patterns.tasksByPriority.high.length,
      medium: patterns.tasksByPriority.medium.length,
      low: patterns.tasksByPriority.low.length,
    },
    insights: getProductivityInsights(patterns, completionRate),
  };

  return {
    priorityRecommendations,
    timeManagementTips,
    productivityInsights,
  };
};

function getPriorityRecommendation(patterns: TaskPatterns): string {
  if (patterns.overdueTasks.length > 0) {
    return `You have ${patterns.overdueTasks.length} overdue task${patterns.overdueTasks.length > 1 ? 's' : ''}. Focus on completing these first.`;
  }
  
  if (patterns.upcomingDeadlines.length > 0) {
    return `You have ${patterns.upcomingDeadlines.length} task${patterns.upcomingDeadlines.length > 1 ? 's' : ''} due in the next 24 hours.`;
  }
  
  if (patterns.tasksByPriority.high.length > 0) {
    return `You have ${patterns.tasksByPriority.high.length} high-priority task${patterns.tasksByPriority.high.length > 1 ? 's' : ''} to focus on.`;
  }
  
  return 'Your task list is well-managed!';
}

function getTimeManagementTips(patterns: TaskPatterns): string[] {
  const tips: string[] = [];
  
  if (patterns.averageCompletionTime > 120) { // If average completion time > 2 hours
    tips.push('Consider breaking down larger tasks into smaller, manageable subtasks');
  }
  
  if (patterns.overdueTasks.length > 0) {
    tips.push('Try setting more realistic deadlines for your tasks');
  }
  
  if (patterns.tasksByPriority.high.length > 5) {
    tips.push('You have many high-priority tasks. Consider re-evaluating task priorities');
  }
  
  // Always include some general tips
  tips.push(
    'Focus on one task at a time for better productivity',
    'Take regular breaks to maintain productivity',
    'Review and adjust your task list at the start of each day'
  );
  
  return tips;
}

function getProductivityInsights(patterns: TaskPatterns, completionRate: number): string[] {
  const insights: string[] = [];
  
  insights.push(`Your task completion rate is ${Math.round(completionRate)}%`);
  
  if (completionRate < 50) {
    insights.push('Try focusing on completing existing tasks before adding new ones');
  } else if (completionRate > 80) {
    insights.push('Great job maintaining a high completion rate!');
  }
  
  const totalTasks = patterns.tasksByPriority.high.length + 
                     patterns.tasksByPriority.medium.length + 
                     patterns.tasksByPriority.low.length;
                     
  if (patterns.tasksByPriority.high.length / totalTasks > 0.5) {
    insights.push('Consider redistributing task priorities - you have many high-priority tasks');
  }
  
  if (patterns.overdueTasks.length > 0) {
    insights.push(`${patterns.overdueTasks.length} overdue task${patterns.overdueTasks.length > 1 ? 's' : ''} may be affecting your productivity`);
  }
  
  return insights;
}
