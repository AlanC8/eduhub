'use client';

import { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useGroups } from '../hooks/useGroups';
import Interceptor from '../../service/Interceptor';

interface TestResult {
  endpoint: string;
  method: string;
  status: number | null;
  success: boolean;
  data: any;
  error: string | null;
  timestamp: string;
  duration?: number;
}

interface TestSuite {
  name: string;
  tests: Array<{
    name: string;
    method: string;
    endpoint: string;
    testFn: () => Promise<any>;
  }>;
}

export default function ApiTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(2);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(4);
  const [autoTesting, setAutoTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const { getAllUsers, getUserById, getUserGroups } = useUsers();
  const { getAllGroups, getGroupById, createGroup, deleteGroup, getGroupUsers } = useGroups();

  // Автоматический запуск всех тестов при загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      runAllTests();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const addTestResult = (result: Omit<TestResult, 'timestamp'>) => {
    const newResult: TestResult = {
      ...result,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [newResult, ...prev]);
  };

  const checkAuthState = () => {
    const interceptor = Interceptor.getInstance();
    const token = interceptor.getToken();
    const role = interceptor.getRole();
    const userId = interceptor.getUserId();
    
    console.log('🔍 Auth State Check:', {
      hasToken: !!token,
      tokenLength: token?.length,
      role,
      userId,
      tokenPreview: token ? `${token.substring(0, 30)}...` : null
    });

    addTestResult({
      endpoint: 'AUTH_CHECK',
      method: 'DEBUG',
      status: token ? 200 : 401,
      success: !!token,
      data: { hasToken: !!token, role, userId, tokenLength: token?.length },
      error: !token ? 'No token found in localStorage' : null
    });
  };

  // Создаем тестовые данные для группы
  const testGroupData = {
    author: "system",
    author_modified: "system", 
    description: "Тестовая группа от API тестера",
    educational_program_id: 1,
    enabled: true,
    is_main_group: false,
    is_study_group: true,
    title: `Test Group ${Date.now()}`
  };

  const testSuites: TestSuite[] = [
    {
      name: "Users API",
      tests: [
        {
          name: "Получить всех пользователей",
          method: "GET",
          endpoint: "/settings/users",
          testFn: getAllUsers
        },
        {
          name: "Получить пользователя по ID",
          method: "GET", 
          endpoint: `/settings/users/${selectedUserId}`,
          testFn: () => getUserById(selectedUserId)
        },
        {
          name: "Получить группы пользователя",
          method: "GET",
          endpoint: `/settings/users/${selectedUserId}/groups`,
          testFn: () => getUserGroups(selectedUserId)
        }
      ]
    },
    {
      name: "Groups API",
      tests: [
        {
          name: "Получить все группы",
          method: "GET",
          endpoint: "/settings/groups",
          testFn: getAllGroups
        },
        {
          name: "Получить группу по ID",
          method: "GET",
          endpoint: `/settings/groups/${selectedGroupId}`,
          testFn: () => getGroupById(selectedGroupId)
        },
        {
          name: "Получить пользователей группы",
          method: "GET",
          endpoint: `/settings/groups/${selectedGroupId}/users`,
          testFn: () => getGroupUsers(selectedGroupId)
        },
        {
          name: "Создать группу",
          method: "POST",
          endpoint: "/settings/groups",
          testFn: () => createGroup(testGroupData)
        }
      ]
    }
  ];

  const runSingleTest = async (test: any, suiteName: string) => {
    const startTime = Date.now();
    setCurrentTest(`${suiteName}: ${test.name}`);
    
    try {
      const response = await test.testFn();
      const duration = Date.now() - startTime;
      
      addTestResult({
        endpoint: test.endpoint,
        method: test.method,
        status: 200,
        success: true,
        data: response,
        error: null,
        duration
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`Error in ${test.name}:`, error);
      
      addTestResult({
        endpoint: test.endpoint,
        method: test.method,
        status: error.response?.status || null,
        success: false,
        data: error.response?.data || null,
        error: error.message || 'Unknown error',
        duration
      });
    }
  };

  const runAllTests = async () => {
    if (autoTesting) return;
    
    setAutoTesting(true);
    setLoading(true);
    setTestResults([]);
    setCurrentTest('Начинаем тестирование...');

    // Проверяем авторизацию
    checkAuthState();
    await new Promise(resolve => setTimeout(resolve, 300));

    // Запускаем все тесты
    for (const suite of testSuites) {
      for (const test of suite.tests) {
        await runSingleTest(test, suite.name);
        await new Promise(resolve => setTimeout(resolve, 500)); // Пауза между тестами
      }
    }

    setCurrentTest('Тестирование завершено!');
    setLoading(false);
    setAutoTesting(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const successCount = testResults.filter(r => r.success).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl text-black font-bold mb-6">🧪 Автоматический API Тестер</h2>
      
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
          <div className="text-sm text-gray-600">Всего тестов</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{successCount}</div>
          <div className="text-sm text-gray-600">Успешно</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{totalTests - successCount}</div>
          <div className="text-sm text-gray-600">Ошибки</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
          <div className="text-sm text-gray-600">Успешность</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg text-black font-semibold mb-4">Управление тестированием</h3>
        
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              User ID:
            </label>
            <input
              id="userId"
              type="number"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="border text-black border-gray-300 rounded px-3 py-2 w-24"
              min="1"
            />
          </div>
          
          <div>
            <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-1">
              Group ID:
            </label>
            <input
              id="groupId"
              type="number"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(Number(e.target.value))}
              className="border text-black border-gray-300 rounded px-3 py-2 w-24"
              min="1"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            🚀 Запустить все тесты
          </button>
          
          <button
            onClick={clearResults}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            🗑️ Очистить результаты
          </button>
        </div>

        {loading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span>{currentTest}</span>
          </div>
        )}
      </div>

      {/* Результаты тестов */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Результаты тестов ({testResults.length})</h3>
          {testResults.length > 0 && (
            <div className="text-sm">
              <span className="text-green-600 mr-4">
                ✅ Успешно: {successCount}
              </span>
              <span className="text-red-600">
                ❌ Ошибки: {totalTests - successCount}
              </span>
            </div>
          )}
        </div>

        {testResults.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Нет результатов тестов. Тесты запустятся автоматически.
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.success 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-mono ${
                      result.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {result.method}
                    </span>
                    <span className="ml-2 font-medium">{result.endpoint}</span>
                    {result.duration && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({result.duration}ms)
                      </span>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>Статус: {result.status || 'N/A'}</div>
                    <div>{result.timestamp}</div>
                  </div>
                </div>

                {result.error && (
                  <div className="text-red-600 text-sm mb-2">
                    <strong>Ошибка:</strong> {result.error}
                  </div>
                )}

                {result.data && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                      Показать данные ответа
                    </summary>
                    <pre className="mt-2 p-3 text-black bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Инструкции */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">ℹ️ Информация:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Тесты запускаются автоматически через 1 секунду после загрузки</li>
          <li>• Проверяется {testSuites.reduce((acc, suite) => acc + suite.tests.length, 0)} эндпойнтов</li>
          <li>• Открой консоль (F12) для детальных логов запросов</li>
          <li>• Статус 200 = успех, 401 = нет авторизации, 404 = не найден</li>
        </ul>
      </div>
    </div>
  );
} 