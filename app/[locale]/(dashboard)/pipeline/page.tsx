"use client";

import { useState, useEffect } from "react";
import { getMockData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Phone, MessageCircle, MoreHorizontal, Plus, Calendar, Clock, ArrowRight, TrendingUp, CheckCircle2, AlertCircle, Search, Filter } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { motion, AnimatePresence } from "framer-motion";

export default function PipelinePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === 'ar';
  
  const { pipelineStages, kanbanLeads } = getMockData(isAr);
  
  const [boardData, setBoardData] = useState<any>(kanbanLeads);
  const [draggedItem, setDraggedItem] = useState<{ id: number, sourceStageId: string } | null>(null);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  // Modals state
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Sync board data when locale changes
  useEffect(() => {
    setBoardData(kanbanLeads);
  }, [locale]);

  const handleDragStart = (e: React.DragEvent, id: number, sourceStageId: string) => {
    setDraggedItem({ id, sourceStageId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoveredStage(stageId);
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    setHoveredStage(null);
    if (!draggedItem) return;
    if (draggedItem.sourceStageId === targetStageId) return;

    setBoardData((prev: any) => {
      const sourceList = [...prev[draggedItem.sourceStageId]];
      const targetList = [...prev[targetStageId]];
      
      const itemIndex = sourceList.findIndex(item => item.id === draggedItem.id);
      if (itemIndex === -1) return prev;
      
      const [movedItem] = sourceList.splice(itemIndex, 1);
      targetList.push(movedItem);

      return {
        ...prev,
        [draggedItem.sourceStageId]: sourceList,
        [targetStageId]: targetList
      };
    });
    setDraggedItem(null);
  };

  const handleDragLeave = () => {
    setHoveredStage(null);
  };

  const openEdit = (lead: any) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const openDelete = (lead: any) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{isAr ? "لوحة المبيعات" : "Sales Board"}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{isAr ? "اسحب الصفقات بين المراحل" : "Drag deals between stages"}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={isAr ? "بحث في الصفقات..." : "Search deals..."} 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 text-slate-700 placeholder:text-slate-400 text-sm"
            />
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsAddDealModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all font-medium text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "إضافة صفقة" : "Add Deal"}
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {pipelineStages.map((stage) => {
          const leads = boardData[stage.id] || [];
          const totalValue = leads.reduce((acc: number, lead: any) => acc + (lead.value || 0), 0);
          const isHovered = hoveredStage === stage.id;
          
          return (
            <div 
              key={stage.id} 
              className="flex flex-col h-full"
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Column Header */}
              <div className={`p-4 rounded-t-2xl border border-b-0 border-slate-200 transition-colors shadow-sm ${isHovered ? 'bg-slate-100' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full shadow-sm ${stage.color}`} />
                    <span className="font-bold text-[15px] text-slate-800">{stage.name}</span>
                  </div>
                  <span className="text-xs bg-white px-2.5 py-1 rounded-full font-bold text-slate-600 shadow-sm border border-slate-200">
                    {leads.length}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-500">
                  {formatCurrency(totalValue)}
                </div>
              </div>

              {/* Cards Container */}
              <div className={`flex-1 p-3 rounded-b-2xl border border-t-0 border-slate-200 bg-slate-50/50 transition-colors shadow-sm ${isHovered ? 'bg-slate-100/70' : ''}`}>
                <div className="space-y-3 min-h-[300px]">
                  <AnimatePresence>
                    {leads.map((lead: any) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={lead.id} 
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-[var(--primary)]/40 cursor-grab active:cursor-grabbing transition-all group"
                        draggable
                        onDragStart={(e: any) => handleDragStart(e, lead.id, stage.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-[15px] text-slate-800">{lead.name}</div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button onClick={() => openEdit(lead)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-500"><Plus className="w-3.5 h-3.5" /></button>
                            <button onClick={() => openDelete(lead)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Added 2d ago</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div className="text-sm font-bold text-emerald-600">
                            {formatCurrency(lead.value)}
                          </div>
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            lead.interest === "ساخن" || lead.interest === "Hot" ? "bg-red-50 text-red-600 border border-red-100" :
                            lead.interest === "دافئ" || lead.interest === "Warm" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {lead.interest}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700">JS</div>
                            <div className="w-7 h-7 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-700">AM</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-green-50 text-slate-400 hover:text-green-600 border border-slate-100 transition-colors">
                              <Phone className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {leads.length === 0 && (
                    <div className="h-[200px] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                      <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6 text-slate-300" />
                      </div>
                      <span className="text-sm font-medium">{isAr ? "اسحب وأفلت هنا" : "Drop deals here"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      <Modal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        title={isAr ? "إضافة صفقة جديدة" : "Add New Deal"}
        maxWidth="lg"
        footer={
          <>
            <button 
              onClick={() => setIsAddDealModalOpen(false)}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button className="px-6 py-2 bg-[var(--primary)] hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all">
              {isAr ? "حفظ الصفقة" : "Save Deal"}
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{isAr ? "اسم الصفقة" : "Deal Name"}</label>
            <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" placeholder="e.g. Website Redesign" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{isAr ? "القيمة" : "Value"}</label>
              <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{isAr ? "مستوى الاهتمام" : "Interest Level"}</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 appearance-none">
                <option value="hot">{isAr ? "ساخن" : "Hot"}</option>
                <option value="warm">{isAr ? "دافئ" : "Warm"}</option>
                <option value="cold">{isAr ? "بارد" : "Cold"}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{isAr ? "المرحلة" : "Pipeline Stage"}</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 appearance-none">
              {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </form>
      </Modal>

      {/* Edit Deal Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={isAr ? "تعديل الصفقة" : "Edit Deal"}
        maxWidth="lg"
        footer={
          <>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button className="px-6 py-2 bg-[var(--primary)] hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all">
              {isAr ? "حفظ التغييرات" : "Save Changes"}
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{isAr ? "اسم الصفقة" : "Deal Name"}</label>
            <input defaultValue={selectedLead?.name} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{isAr ? "القيمة" : "Value"}</label>
              <input defaultValue={selectedLead?.value} type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{isAr ? "مستوى الاهتمام" : "Interest Level"}</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 appearance-none">
                <option value="hot">{isAr ? "ساخن" : "Hot"}</option>
                <option value="warm">{isAr ? "دافئ" : "Warm"}</option>
                <option value="cold">{isAr ? "بارد" : "Cold"}</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Deal Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={isAr ? "حذف الصفقة" : "Delete Deal"}
        maxWidth="sm"
        footer={
          <>
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                // Implement delete logic here
                setIsDeleteModalOpen(false);
              }}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center gap-2"
            >
              {isAr ? "تأكيد الحذف" : "Confirm Delete"}
            </button>
          </>
        }
      >
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {isAr ? "هل أنت متأكد؟" : "Are you sure?"}
          </h3>
          <p className="text-slate-500">
            {isAr 
              ? "سيتم حذف هذه الصفقة نهائياً. لا يمكن التراجع عن هذا الإجراء." 
              : "This deal will be permanently deleted. This action cannot be undone."}
          </p>
        </div>
      </Modal>
    </div>
  );
}

// Ensure lucide icon 'X' is imported for edit/delete buttons
import { X } from "lucide-react";
