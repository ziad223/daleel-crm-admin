"use client";

import { useState, useEffect } from "react";
import { getMockData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Phone, MessageCircle, MoreHorizontal } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function PipelinePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === 'ar';
  
  const { pipelineStages, kanbanLeads } = getMockData(isAr);
  
  const [boardData, setBoardData] = useState<any>(kanbanLeads);
  const [draggedItem, setDraggedItem] = useState<{ id: number, sourceStageId: string } | null>(null);

  // Sync board data when locale changes
  useEffect(() => {
    setBoardData(kanbanLeads);
  }, [locale]);

  const handleDragStart = (e: React.DragEvent, id: number, sourceStageId: string) => {
    setDraggedItem({ id, sourceStageId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
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
    
    // Here you would typically also ask for "Reason for transfer" or "Reason for loss" if target is Lost
    if (targetStageId === "lost") {
      // Simulate asking for reason
      console.log("Ask for loss reason for lead:", draggedItem.id);
    }
    
    setDraggedItem(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-[var(--muted)]">{t("pipeline.subtitle")}</p>
        <div className="flex gap-2">
          <button className="btn-outline">{t("common.edit")}</button>
          <button className="btn-accent">{t("pipeline.addDeal")}</button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => {
          const leads = boardData[stage.id] || [];
          return (
            <div 
              key={stage.id} 
              className="kanban-column transition-colors duration-200"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="font-semibold text-sm">{stage.name}</span>
                </div>
                <span className="text-xs bg-white px-2 py-0.5 rounded-full font-medium text-slate-500">
                  {leads.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {leads.map((lead: any) => (
                  <div 
                    key={lead.id} 
                    className="kanban-card cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-[var(--primary)]/20"
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id, stage.id)}
                  >
                    <div className="font-medium text-sm mb-1">{lead.name}</div>
                    <div className="text-xs text-slate-500 mb-2">{lead.phone}</div>
                    {lead.value > 0 && (
                      <div className="text-sm font-semibold text-emerald-600 mb-2">
                        {formatCurrency(lead.value)}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`badge ${
                        lead.interest === "ساخن" || lead.interest === "Hot" ? "badge-danger" :
                        lead.interest === "دافئ" || lead.interest === "Warm" ? "badge-warning" : "badge-neutral"
                      } text-[10px]`}>
                        {lead.interest}
                      </span>
                      <div className="flex gap-1 relative group/actions">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[var(--primary)]"><Phone className="w-3 h-3" /></button>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600"><MessageCircle className="w-3 h-3" /></button>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><MoreHorizontal className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <div className="h-full min-h-[100px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                    {t("pipeline.dragHere")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
