/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { technicalDocs } from '../data/docs';
import { FileText, Layout, Database, Cpu, Palette, Milestone, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface TechHubProps {
  lang: 'ar' | 'en';
}

export default function TechHub({ lang }: TechHubProps) {
  const [activeTab, setActiveTab] = useState<string>('srs');
  const [copied, setCopied] = useState<string | null>(null);

  const tabs = [
    { id: 'srs', icon: FileText, labelEn: 'SRS Specs', labelAr: 'وثيقة المتطلبات' },
    { id: 'architecture', icon: Layout, labelEn: 'Architecture Map', labelAr: 'بنية النظام' },
    { id: 'database', icon: Database, labelEn: 'Firestore & Security', labelAr: 'قواعد البيانات' },
    { id: 'apis', icon: Cpu, labelEn: 'API Schema Contracts', labelAr: 'عقود واجهة البرمجة' },
    { id: 'design', icon: Palette, labelEn: 'Design Tokens', labelAr: 'نظام التصميم' },
    { id: 'roadmap', icon: Milestone, labelEn: 'Roadmap & QA', labelAr: 'خطة العمل والتحقق' },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentDoc = technicalDocs[activeTab];

  // Simple, robust custom Markdown renderer for the structured documentation
  const renderMarkdown = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => {
      // Check for code blocks
      if (paragraph.startsWith('```')) {
        const lines = paragraph.split('\n');
        const language = lines[0].replace('```', '') || 'code';
        const codeContent = lines.slice(1, -1).join('\n');
        return (
          <div key={idx} className="relative my-6 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5 font-sans">
                <Terminal size={14} className="text-masari-cyan" />
                {language.toUpperCase()}
              </span>
              <button
                id={`copy-btn-${idx}`}
                onClick={() => handleCopy(codeContent, `code-${idx}`)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer"
              >
                {copied === `code-${idx}` ? (
                  <>
                    <Check size={12} className="text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-300 custom-scrollbar whitespace-pre">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Check for bullet list
      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
        return (
          <ul key={idx} className="list-disc pl-6 pr-6 space-y-2 my-4 text-slate-600 text-sm leading-relaxed">
            {paragraph.split('\n').map((line, lIdx) => {
              const cleanLine = line.replace(/^[\s*-]+/, '').trim();
              // Parse bold markers **
              return (
                <li key={lIdx}>
                  {parseInlineFormatting(cleanLine)}
                </li>
              );
            })}
          </ul>
        );
      }

      // Check for task checklist
      if (paragraph.startsWith('- [ ]') || paragraph.startsWith('- [x]')) {
        return (
          <div key={idx} className="space-y-3 my-4">
            {paragraph.split('\n').map((line, lIdx) => {
              const checked = line.includes('- [x]');
              const cleanLine = line.replace(/- \[[ x]\]/, '').trim();
              return (
                <div key={lIdx} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded border ${checked ? 'bg-masari-blue border-masari-blue text-white' : 'border-slate-300'}`}>
                    {checked && <Check size={12} />}
                  </span>
                  <span>{parseInlineFormatting(cleanLine)}</span>
                </div>
              );
            })}
          </div>
        );
      }

      // Check for headings
      if (paragraph.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-slate-800 mt-6 mb-3 border-b border-slate-100 pb-2 font-sans">{paragraph.replace('### ', '')}</h3>;
      }
      if (paragraph.startsWith('#### ')) {
        return <h4 key={idx} className="text-base font-semibold text-slate-800 mt-4 mb-2 font-sans">{paragraph.replace('#### ', '')}</h4>;
      }

      // Check for table
      if (paragraph.includes('|') && paragraph.split('\n')[1]?.includes('-')) {
        const lines = paragraph.split('\n');
        const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
        const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean)).filter(row => row.length > 0);
        return (
          <div key={idx} className="overflow-x-auto my-6 border border-slate-200 rounded-lg">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-sans font-medium border-b border-slate-200">
                <tr>
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                    {row.map((cell, cIdx) => {
                      // Check for custom color blocks rendered as raw HTML style
                      if (cell.includes('<span style=')) {
                        const hexVal = cell.match(/#[A-Za-z0-9]+/)?.[0] || '';
                        return (
                          <td key={cIdx} className="px-4 py-3 font-mono text-xs">
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded border border-slate-200" style={{ backgroundColor: hexVal }} />
                              {hexVal}
                            </span>
                          </td>
                        );
                      }
                      return <td key={cIdx} className="px-4 py-3">{parseInlineFormatting(cell)}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Default paragraph
      return <p key={idx} className="text-slate-600 text-sm leading-relaxed my-3 font-sans">{parseInlineFormatting(paragraph)}</p>;
    });
  };

  // Quick helper to parse **bold** and `code` formatting
  const parseInlineFormatting = (text: string) => {
    let parts: React.ReactNode[] = [text];
    
    // Bold parsing
    if (text.includes('**')) {
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      const newParts: React.ReactNode[] = [];
      let lastIndex = 0;
      
      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          newParts.push(text.substring(lastIndex, match.index));
        }
        newParts.push(<strong key={match.index} className="font-bold text-slate-800">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < text.length) {
        newParts.push(text.substring(lastIndex));
      }
      parts = newParts;
    }

    // Inline code parsing
    const processInlineCode = (nodes: React.ReactNode[]): React.ReactNode[] => {
      const inlineCodeRegex = /`([^`]+)`/g;
      const result: React.ReactNode[] = [];
      
      nodes.forEach((node, nodeIdx) => {
        if (typeof node === 'string') {
          let match;
          let lastIndex = 0;
          
          if (!node.includes('`')) {
            result.push(node);
            return;
          }

          while ((match = inlineCodeRegex.exec(node)) !== null) {
            if (match.index > lastIndex) {
              result.push(node.substring(lastIndex, match.index));
            }
            result.push(
              <code key={`${nodeIdx}-${match.index}`} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs text-masari-blue">
                {match[1]}
              </code>
            );
            lastIndex = inlineCodeRegex.lastIndex;
          }
          
          if (lastIndex < node.length) {
            result.push(node.substring(lastIndex));
          }
        } else {
          result.push(node);
        }
      });
      return result;
    };

    return processInlineCode(parts);
  };

  return (
    <div id="tech-hub" className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-full">
      {/* Header Banner */}
      <div className="bg-slate-900 px-6 py-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-masari-cyan text-xs font-mono tracking-wider uppercase font-semibold">
            {lang === 'ar' ? 'المستودع التقني ومخطط البنية التحتية' : 'Technical Specifications & Architecture Hub'}
          </span>
          <h2 className="text-xl font-bold font-sans mt-1">
            {lang === 'ar' ? 'مساري - مستندات التأسيس والمواصفات' : 'Masari - Blueprint & Foundation Specs'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
            PHASE_01_FOUNDATION
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-[10px] font-mono text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            STANDALONE_VALIDATED
          </span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="border-b border-slate-200 bg-slate-50/50 p-2 overflow-x-auto flex gap-1 custom-scrollbar shrink-0">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-masari-blue text-white shadow-md shadow-masari-blue/15'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <TabIcon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Documentation Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900 font-sans">
              {lang === 'ar' ? currentDoc.titleAr : currentDoc.titleEn}
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-1">
              File Location: <code className="text-masari-blue">/src/data/docs.ts &bull; active_tab: {activeTab}</code>
            </p>
          </div>

          {/* Render Markdown-like content */}
          <div className="space-y-4">
            {renderMarkdown(currentDoc.markdown)}
          </div>

          {/* Call to action footer */}
          <div className="mt-12 p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-masari-blue/10 flex items-center justify-center text-masari-blue">
                <Layout size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {lang === 'ar' ? 'هل أنت مستعد للانتقال للمرحلة الثانية؟' : 'Ready for Phase Two Integration?'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {lang === 'ar' ? 'قواعد بيانات فيربيز وملفات الطيران جاهزة للربط فوراً.' : 'Firestore collections, API routing, and models are fully pre-validated.'}
                </p>
              </div>
            </div>
            <button
              id="cta-next-phase-btn"
              onClick={() => setActiveTab('roadmap')}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'عرض خريطة العمل كاملة' : 'View Core Milestones'}</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
