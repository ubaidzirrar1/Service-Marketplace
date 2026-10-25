
import React, { useState, useEffect } from 'react';
import { ChatThread, ChatMessage } from '../types';
import { MessageService } from '../services/api';

const InboxView: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInbox = async () => {
      setIsLoading(true);
      const data = await MessageService.getThreads();
      setThreads(data);
      if (data.length > 0) setSelectedThread(data[0]);
      setIsLoading(false);
    };
    loadInbox();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread) return;

    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedThread = {
      ...selectedThread,
      messages: [...selectedThread.messages, msg],
      lastMessage: newMessage
    };

    setSelectedThread(updatedThread);
    setThreads(prev => prev.map(t => t.id === selectedThread.id ? updatedThread : t));
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white overflow-hidden">
      {/* Threads List */}
      <aside className="w-full md:w-96 border-r flex flex-col bg-slate-50">
        <div className="p-8 border-b bg-white">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Messages</h1>
          <div className="relative mt-4">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="p-10 text-center animate-pulse text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loading Inbox...</div>
          ) : threads.map(t => (
            <div 
              key={t.id} 
              onClick={() => setSelectedThread(t)}
              className={`p-6 border-b cursor-pointer transition-all flex items-center gap-4 ${selectedThread?.id === t.id ? 'bg-white border-l-4 border-l-blue-600' : 'hover:bg-slate-100'}`}
            >
              <div className="relative shrink-0">
                <img src={t.participantAvatar} className="w-12 h-12 rounded-full object-cover shadow-sm" alt="" />
                {t.unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{t.unreadCount}</span>}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-black text-slate-800 truncate">{t.participantName}</h4>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.time}</span>
                </div>
                <p className={`text-xs truncate ${t.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{t.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="hidden md:flex flex-grow flex-col">
        {selectedThread ? (
          <>
            <header className="p-6 border-b flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-4">
                <img src={selectedThread.participantAvatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div>
                  <h3 className="font-black text-slate-800 tracking-tight">{selectedThread.participantName}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                </button>
              </div>
            </header>

            <div className="flex-grow overflow-y-auto p-10 space-y-8 bg-slate-50/50">
              {selectedThread.messages.map(m => (
                <div key={m.id} className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-6 rounded-[32px] shadow-sm ${m.senderId === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                    <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                    <p className={`text-[9px] mt-2 font-black uppercase tracking-widest ${m.senderId === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>{m.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 border-t bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-slate-50 p-2 rounded-[32px] border border-slate-100 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                <button type="button" className="p-4 text-slate-400 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a professional message..." 
                  className="flex-grow bg-transparent border-none py-4 text-sm font-bold text-slate-800 placeholder-slate-400 focus:ring-0"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                >
                  <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-20 text-center bg-slate-50/30">
            <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center text-blue-100 mb-8 shadow-sm">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Select a Conversation</h2>
            <p className="text-slate-400 font-bold max-w-sm">Connect with clients and professionals to discuss project details and milestones.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default InboxView;
