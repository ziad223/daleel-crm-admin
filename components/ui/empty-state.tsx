"use client";

import { Search, FolderOpen } from "lucide-react";
import { useLocale } from "next-intl";

interface EmptyStateProps {
  isSearch?: boolean;
  searchQuery?: string;
}

export function EmptyState({ isSearch = false, searchQuery = "" }: EmptyStateProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-slate-50 border-2 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        {isSearch ? (
          <div className="relative">
            <Search className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-red-500 font-bold">!</span>
            </div>
          </div>
        ) : (
          <FolderOpen className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
        )}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        {isSearch 
          ? (isAr ? "لا توجد نتائج بحث" : "No search results found")
          : (isAr ? "لا توجد بيانات بعد" : "No data available yet")}
      </h3>
      <p className="text-slate-500 max-w-sm mx-auto">
        {isSearch 
          ? (isAr 
              ? `لم نتمكن من العثور على أي نتائج تطابق "${searchQuery}". جرب استخدام كلمات مختلفة.`
              : `We couldn't find any results matching "${searchQuery}". Try using different keywords.`)
          : (isAr 
              ? "لا يوجد أي محتوى لعرضه هنا في الوقت الحالي. يمكنك إضافة بيانات جديدة لتبدأ."
              : "There is no content to display here right now. Add new data to get started.")}
      </p>
    </div>
  );
}
