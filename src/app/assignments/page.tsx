// app/assignments/page.tsx
'use client';

import React, { useState } from 'react';
import { useAssignments } from '@/hooks/useAssignments';
import type { Assignment, AssignmentFile, Submission, SubmissionFile, AssignmentFilter } from '@/types';

// Иконки
import {
  Home, ChevronRight, ListChecks, Clock, CheckCircle, AlertTriangle, AlertCircle as AlertInfo,
  Paperclip, Download, MessageSquare, UploadCloud, Send, Eye, FileText, Edit2, Trash2, X, User, CalendarDays, Star
} from 'lucide-react';
import { format, parseISO, differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Toast } from '@/components/Toast';

// Фильтры для UI
const filterOptions: { label: string; value: AssignmentFilter, icon: React.ElementType }[] = [
  { label: 'Предстоящие', value: 'upcoming', icon: Clock },
  { label: 'Просроченные', value: 'late', icon: AlertTriangle },
  { label: 'Выполненные', value: 'completed', icon: CheckCircle },
  { label: 'Все задания', value: 'all', icon: ListChecks },
];

// Компонент для отображения одного файла
const FileChip: React.FC<{ file: AssignmentFile | SubmissionFile; onDownload: (fileId: number, filename: string) => void; type?: 'assignment' | 'submission' }> = ({ file, onDownload, type = 'assignment' }) => {
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="text-red-500" size={18} />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="text-blue-500" size={18} />;
    if (['xls', 'xlsx'].includes(ext || '')) return <FileText className="text-green-500" size={18} />;
    if (['ppt', 'pptx'].includes(ext || '')) return <FileText className="text-orange-500" size={18} />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return <Paperclip className="text-purple-500" size={18} />; // Можно использовать иконку изображения
    return <Paperclip className="text-gray-500" size={18} />;
  };

  return (
    <div className="flex items-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md p-2 text-xs transition-colors">
      <span className="mr-2 shrink-0">{getFileIcon(file.filename)}</span>
      <span className="truncate flex-grow mr-2" title={file.filename}>{file.filename}</span>
      <button
        onClick={() => onDownload(file.fileId, file.filename)}
        className="ml-auto text-violet-600 hover:text-violet-800 p-1 rounded-full hover:bg-violet-100"
        title="Скачать файл"
      >
        <Download size={16} />
      </button>
    </div>
  );
};

// Компонент для отображения одного задания
export const AssignmentCard: React.FC<{
  assignment: Assignment;
  onViewDetails: (assignmentId: number) => void;
  onDownloadFile: (fileId: number, filename: string) => void;
  onSubmitAssignment: (assignmentId: number) => void;
  onDelete?: (assignmentId: number) => void;
  isTeacherView?: boolean;
}> = ({ assignment, onViewDetails, onDownloadFile, onSubmitAssignment, onDelete, isTeacherView }) => {
  const deadlineDate = parseISO(assignment.deadline);
  const now = new Date();
  const daysLeft = differenceInDays(deadlineDate, now);
  const isPastDeadline = deadlineDate < now;
  const submission = assignment.currentUserSubmission;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    
    if (window.confirm('Вы уверены, что хотите удалить это задание? Это действие нельзя отменить.')) {
      try {
        await onDelete(assignment.assignmentId);
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  let statusText = '';
  let statusColor = '';
  let statusIcon: React.ElementType = Clock;

  if (submission) {
    if (submission.grade !== null) {
      statusText = `Оценено: ${submission.grade}/100`;
      statusColor = 'bg-green-100 text-green-700';
      statusIcon = CheckCircle;
    } else if (submission.isLate) {
      statusText = 'Сдано с опозданием';
      statusColor = 'bg-yellow-100 text-yellow-700';
      statusIcon = AlertTriangle;
    } else {
      statusText = 'Сдано вовремя';
      statusColor = 'bg-sky-100 text-sky-700';
      statusIcon = CheckCircle;
    }
  } else {
    if (isPastDeadline) {
      statusText = 'Просрочено';
      statusColor = 'bg-red-100 text-red-700';
      statusIcon = AlertTriangle;
    } else {
      statusText = `Осталось: ${formatDistanceToNowStrict(deadlineDate, { addSuffix: false, locale: ru })}`;
      if (daysLeft < 0) statusText = "Дедлайн сегодня"; // Не совсем точно, но для примера
      else if (daysLeft < 3) statusColor = 'bg-orange-100 text-orange-700';
      else statusColor = 'bg-blue-100 text-blue-700';
      statusIcon = Clock;
    }
  }
  const StatusIconComponent = statusIcon;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="text-lg font-semibold text-violet-700 hover:text-violet-800 cursor-pointer truncate flex-1 mr-3"
            title={assignment.title}
            onClick={() => onViewDetails(assignment.assignmentId)}
          >
            {assignment.title}
          </h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center whitespace-nowrap ${statusColor}`}>
            <StatusIconComponent size={14} className="mr-1.5" />
            {statusText}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          <User size={12} className="inline mr-1 opacity-70" /> Преподаватель: {assignment.educatorName}
        </p>
        <p className="text-xs text-gray-500">
          <CalendarDays size={12} className="inline mr-1 opacity-70" /> Дедлайн: {format(deadlineDate, 'd MMMM yyyy, HH:mm', { locale: ru })}
        </p>
      </div>

      <div className="p-5 flex-grow">
        <p className="text-sm text-gray-700 mb-3 line-clamp-3" title={assignment.description}>
          {assignment.description}
        </p>
        {assignment.files && assignment.files.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 mb-1.5">Прикрепленные файлы:</p>
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {assignment.files.map(file => <FileChip key={file.fileId} file={file} onDownload={onDownloadFile} />)}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={() => onViewDetails(assignment.assignmentId)}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-violet-700 bg-violet-100 hover:bg-violet-200 rounded-lg transition-colors flex items-center justify-center"
        >
          <Eye size={16} className="mr-2" /> Подробнее
        </button>
        
        {isTeacherView && onDelete && (
          <button
            onClick={handleDelete}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center justify-center"
          >
            <Trash2 size={16} className="mr-2" /> Удалить
          </button>
        )}
        
        {!isTeacherView && (
          <>
            {!submission && !isPastDeadline && (
              <button
                onClick={() => onSubmitAssignment(assignment.assignmentId)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center"
              >
                <UploadCloud size={16} className="mr-2" /> Сдать работу
              </button>
            )}
            {submission && !submission.grade && (
              <button
                onClick={() => alert('Редактирование/отзыв сдачи (не реализовано)')}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center"
              >
                <Edit2 size={16} className="mr-2" /> Моя сдача
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Модальное окно для деталей задания
export const AssignmentDetailModal: React.FC<{
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadFile: (fileId: number, filename: string) => void;
}> = ({ assignment, isOpen, onClose, onDownloadFile }) => {
  if (!isOpen || !assignment) return null;
  const submission = assignment.currentUserSubmission;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-violet-700 break-words">{assignment.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-100 transition-colors">
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Преподаватель: {assignment.educatorName}</p>
          <p className="text-sm text-gray-500">Дедлайн: {format(parseISO(assignment.deadline), 'd MMMM yyyy, HH:mm', { locale: ru })}</p>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <div>
            <h4 className="text-md font-semibold text-black mb-2">Описание задания:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{assignment.description}</p>
          </div>

          {assignment.files && assignment.files.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-black mb-2">Файлы задания:</h4>
              <div className="space-y-2">
                {assignment.files.map(file => <FileChip key={file.fileId} file={file} onDownload={onDownloadFile} />)}
              </div>
            </div>
          )}

          {submission && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-violet-600 mb-3">Ваша сдача:</h4>
              <div className="space-y-3 text-sm">
                <p><strong>Статус:</strong> {submission.isLate ? 'Сдано с опозданием' : 'Сдано вовремя'}</p>
                <p><strong>Дата сдачи:</strong> {format(parseISO(submission.submittedAt), 'd MMMM yyyy, HH:mm', { locale: ru })}</p>
                {submission.comment && <p><strong>Комментарий:</strong> {submission.comment}</p>}
                {submission.grade !== null && <p><strong>Оценка:</strong> <span className="font-bold text-xl text-green-600">{submission.grade}/100</span></p>}
                {submission.feedback && <p><strong>Отзыв преподавателя:</strong> {submission.feedback}</p>}
                {submission.reviewedAt && <p><strong>Проверено:</strong> {format(parseISO(submission.reviewedAt), 'd MMMM yyyy, HH:mm', { locale: ru })}</p>}
                
                {submission.files && submission.files.length > 0 && (
                    <div className="mt-2">
                        <p className="font-medium text-gray-700 mb-1">Прикрепленные файлы к сдаче:</p>
                        <div className="space-y-1.5">
                            {submission.files.map(file => <FileChip key={file.fileId} file={file} onDownload={onDownloadFile} type="submission"/>)}
                        </div>
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

// Модальное окно для сдачи задания (упрощенное)
const SubmitAssignmentModal: React.FC<{
    assignmentId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (assignmentId: number, comment: string, files: FileList | null) => void;
}> = ({ assignmentId, isOpen, onClose, onSubmit}) => {
    const [comment, setComment] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    if (!isOpen || assignmentId === null) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(assignmentId, comment, selectedFiles);
        onClose(); // Закрыть после попытки отправки
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-violet-700">Сдача задания</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-100 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="submissionComment" className="block text-sm font-medium text-gray-700 mb-1">Комментарий (необязательно)</label>
                        <textarea
                            id="submissionComment"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="submissionFiles" className="block text-sm font-medium text-gray-700 mb-1">Прикрепить файлы</label>
                        <input
                            type="file"
                            id="submissionFiles"
                            multiple
                            onChange={(e) => setSelectedFiles(e.target.files)}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        />
                        {selectedFiles && Array.from(selectedFiles).length > 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                                Выбрано файлов: {selectedFiles.length}
                                <ul className="list-disc list-inside">
                                    {Array.from(selectedFiles).map(f => <li key={f.name} className="truncate">{f.name}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Отмена
                    </button>
                    <button type="submit" className="px-5 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition-colors flex items-center">
                        <Send size={16} className="mr-2" /> Отправить
                    </button>
                </div>
            </form>
        </div>
    );
};


// Основной компонент страницы
const AssignmentsPage: React.FC = () => {
  // TODO: Get these from context or props
  const studentId = 2; // Temporary hardcoded value
  const disciplineId = 3; // Temporary hardcoded value

  const {
    assignments,
    selectedAssignmentDetail: selectedAssignment,
    loading,
    error,
    currentFilter,
    fetchAssignmentById: getAssignmentById,
    downloadFile: downloadAssignmentFile,
    changeFilter,
    clearSelectedAssignmentDetail: clearSelectedAssignment,
  } = useAssignments(studentId, disciplineId);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const handleViewDetails = async (assignmentId: number) => {
    await getAssignmentById(assignmentId);
    setIsDetailModalOpen(true);
  };

  const handleOpenSubmitModal = (assignmentId: number) => {
    setSubmittingAssignmentId(assignmentId);
    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
    setSubmittingAssignmentId(null);
  };

  const handleSubmitAssignment = async (assignmentId: number, comment: string, files: FileList | null) => {
    try {
      const formData = new FormData();
      formData.append('studentId', studentId.toString());
      formData.append('assignmentId', assignmentId.toString());
      formData.append('comment', comment);
      
      if (files) {
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
      }

      // TODO: Раскомментировать когда сервис будет работать
      /* 
      const response = await fetch('http://localhost:8081/submissions', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      */

      // Имитация успешного сохранения
      console.log('Имитация отправки задания:', {
        studentId,
        assignmentId,
        comment,
        filesCount: files ? files.length : 0
      });

      // Создаем фиктивный submission для имитации успешной отправки
      const mockSubmission = {
        submissionId: Math.floor(Math.random() * 1000),
        studentId: studentId,
        assignmentId: assignmentId,
        submittedAt: new Date().toISOString(),
        comment: comment,
        isLate: false,
        grade: null,
        feedback: null,
        studentFullName: "Текущий студент",
        reviewedAt: null,
        files: files ? Array.from(files).map((file, index) => ({
          fileId: Math.floor(Math.random() * 1000) + index,
          filename: file.name
        })) : []
      };

      // Обновляем состояние задания в UI
      const updatedAssignment = assignments.find(a => a.assignmentId === assignmentId);
      if (updatedAssignment) {
        updatedAssignment.currentUserSubmission = mockSubmission;
      }

      // Имитация успешного обновления
      await getAssignmentById(assignmentId);
      handleCloseSubmitModal();
      
      // Показываем уведомление об успехе
      setToastMessage('Задание успешно отправлено!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setToastMessage('Ошибка при отправке задания. Попробуйте еще раз.');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-100 to-gray-200 p-5 sm:p-8 font-sans text-black">
      <div className="max-w-full mx-auto">
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-violet-700 transition-colors flex items-center"><Home size={18} className="mr-2" />ГЛАВНАЯ</a></li>
            <li><ChevronRight size={18} className="text-gray-400" /></li>
            <li className="font-semibold text-violet-700">Задания</li>
          </ol>
        </nav>

        <header className="mb-8 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-extrabold text-violet-700 flex items-center">
              <ListChecks size={32} className="mr-3 text-violet-600" />
              Мои Задания
            </h1>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => changeFilter(opt.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-all duration-150
                    ${currentFilter === opt.value
                      ? 'bg-violet-600 text-white shadow-md ring-2 ring-violet-300'
                      : 'bg-white text-gray-700 hover:bg-violet-50 border border-gray-300 hover:border-violet-300'
                    }`}
                >
                  <opt.icon size={16} className="mr-2" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
           {/* TODO: Добавить селект для дисциплины, если их несколько */}
        </header>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            <p className="ml-4 text-gray-600">Загрузка заданий...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md mb-6" role="alert">
            <div className="flex items-center">
              <AlertTriangle size={24} className="mr-3" />
              <div>
                <p className="font-bold">Ошибка загрузки</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && assignments.length === 0 && (
          <div className="text-center py-16 text-gray-500 flex flex-col items-center bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <AlertInfo size={48} className="text-sky-400 mb-4" />
            <p className="text-lg font-medium text-black">Нет заданий</p>
            <p className="text-sm">Для текущего фильтра "{filterOptions.find(f => f.value === currentFilter)?.label || currentFilter}" задания отсутствуют.</p>
          </div>
        )}

        {!loading && assignments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {assignments.map(assignment => (
              <AssignmentCard
                key={assignment.assignmentId}
                assignment={assignment}
                onViewDetails={handleViewDetails}
                onDownloadFile={downloadAssignmentFile}
                onSubmitAssignment={handleOpenSubmitModal}
                onDelete={() => {}} // Placeholder for delete functionality
                isTeacherView={false}
              />
            ))}
          </div>
        )}

        <AssignmentDetailModal
          assignment={selectedAssignment}
          isOpen={isDetailModalOpen}
          onClose={() => { setIsDetailModalOpen(false); clearSelectedAssignment(); }}
          onDownloadFile={downloadAssignmentFile}
        />
        
        <SubmitAssignmentModal
            assignmentId={submittingAssignmentId}
            isOpen={isSubmitModalOpen}
            onClose={handleCloseSubmitModal}
            onSubmit={handleSubmitAssignment}
        />

        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}

        <footer className="text-center mt-16 mb-8 py-6 border-t border-gray-300/50">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Учебное заведение. Все права защищены.</p>
        </footer>
      </div>
    </main>
  );
};

export default AssignmentsPage;