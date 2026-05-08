import React from 'react';
import { X, Share, Calendar, FileText, Grid, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl overflow-hidden relative z-10"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 flex justify-between items-center bg-surface-container-low/50">
              <div className="flex items-center gap-3 text-primary">
                <Share size={24} />
                <h3 className="text-2xl font-extrabold tracking-tight font-headline">Export Data</h3>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              <div>
                <h4 className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Select Date Range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-semibold text-on-surface-variant block pl-1">Start Date</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" 
                        type="text" 
                        defaultValue="Jan 01, 2023"
                        readOnly
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-xs font-semibold text-on-surface-variant block pl-1">End Date</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" 
                        type="text" 
                        defaultValue="Dec 31, 2023"
                        readOnly
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Export Options</h4>
                <div className="space-y-3">
                  <ExportOption 
                    icon={<FileText size={20} />}
                    title="Comprehensive Report"
                    description="Soil, Weather, and Yield data bundled"
                    selected={true}
                  />
                  <ExportOption 
                    icon={<Grid size={20} />}
                    title="Raw CSV Data"
                    description="Perfect for advanced spreadsheet analysis"
                    selected={false}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                  <FileDown size={20} />
                  Download PDF
                </button>
                <p className="text-center mt-4 text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Your report will be generated in approximately 30 seconds.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ExportOption = ({ icon, title, description, selected }: any) => (
  <div className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer group ${selected ? 'bg-emerald-50' : 'bg-surface-container hover:bg-emerald-50/50'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm ${selected ? 'text-primary' : 'text-on-surface-variant'}`}>
        {icon}
      </div>
      <div>
        <span className="block font-bold text-on-surface text-sm">{title}</span>
        <span className="text-[10px] text-on-surface-variant font-label">{description}</span>
      </div>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary' : 'border-outline-variant'}`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
    </div>
  </div>
);
