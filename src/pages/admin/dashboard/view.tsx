
import { Users, FileQuestion, ArrowUpRight, ArrowDownRight, BarChart2, PieChart } from 'lucide-react';

// Mock data
const userData = {
  totalUsers: 1234,
  newUsers: 56,
  activeUsers: 789,
};

const questionnaireData = {
  totalQuestionnaires: 45,
  completedQuestionnaires: 32,
  averageCompletionTime: '15 minutes',
};

const UserOverviewCard = ({ title, value, icon: Icon, change, isPositive } : any) => (
  <div className="flex items-center p-6 bg-white rounded-lg shadow">
    <div className="mr-4">
      <Icon size={24} className="text-blue-500" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change && (
        <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </p>
      )}
    </div>
  </div>
);

const QuestionnaireOverviewCard = ({ title, value, icon: Icon }: any) => (
  <div className="p-6 bg-white rounded-lg shadow">
    <div className="flex items-center mb-4">
      <Icon size={24} className="mr-2 text-blue-500" />
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export default function DashboardView() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">User Management Overview</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <UserOverviewCard 
            title="Total Users" 
            value={userData.totalUsers} 
            icon={Users} 
            change="+12% from last month" 
            isPositive={true} 
          />
          <UserOverviewCard 
            title="New Users" 
            value={userData.newUsers} 
            icon={Users} 
            change="-3% from last week" 
            isPositive={false} 
          />
          <UserOverviewCard 
            title="Active Users" 
            value={userData.activeUsers} 
            icon={Users} 
          />
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Questionnaire Overview</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <QuestionnaireOverviewCard 
            title="Total Questionnaires" 
            value={questionnaireData.totalQuestionnaires} 
            icon={FileQuestion} 
          />
          <QuestionnaireOverviewCard 
            title="Completed Questionnaires" 
            value={questionnaireData.completedQuestionnaires} 
            icon={FileQuestion} 
          />
          <QuestionnaireOverviewCard 
            title="Average Completion Time" 
            value={questionnaireData.averageCompletionTime} 
            icon={FileQuestion} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-xl font-semibold text-gray-700">User Growth</h3>
          <div className="flex items-center justify-center h-64">
            <BarChart2 size={200} className="text-blue-500" />
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-xl font-semibold text-gray-700">Questionnaire Completion Rate</h3>
          <div className="flex items-center justify-center h-64">
            <PieChart size={200} className="text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}