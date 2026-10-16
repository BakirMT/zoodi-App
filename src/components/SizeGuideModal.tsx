import React, { useState } from 'react';
import {
  X,
  Ruler,
  Check,
  Info,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../types';

interface SizeGuideModalProps {
  product: Product;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onClose: () => void;
}

interface SizeRow {
  size: string;
  col1: { in: string; cm: string };
  col2: { in: string; cm: string };
  col3: { in: string; cm: string };
  col4?: { in: string; cm: string };
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  product,
  selectedSize,
  onSelectSize,
  onClose,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeTab, setActiveTab] = useState<'table' | 'howToMeasure'>('table');

  const isFootwear =
    product.category === 'Footwear' ||
    product.subcategory.toLowerCase().includes('shoe') ||
    product.subcategory.toLowerCase().includes('sneaker') ||
    product.subcategory.toLowerCase().includes('heel') ||
    product.subcategory.toLowerCase().includes('sandal');

  const isMen = product.category === 'Men';

  // Women's apparel size data
  const womenClothingSizes: SizeRow[] = [
    {
      size: 'XS',
      col1: { in: '32', cm: '81' },
      col2: { in: '26', cm: '66' },
      col3: { in: '35', cm: '89' },
      col4: { in: '38', cm: '96' },
    },
    {
      size: 'S',
      col1: { in: '34', cm: '86' },
      col2: { in: '28', cm: '71' },
      col3: { in: '37', cm: '94' },
      col4: { in: '39', cm: '99' },
    },
    {
      size: 'M',
      col1: { in: '36', cm: '91' },
      col2: { in: '30', cm: '76' },
      col3: { in: '39', cm: '99' },
      col4: { in: '40', cm: '101' },
    },
    {
      size: 'L',
      col1: { in: '38', cm: '96' },
      col2: { in: '32', cm: '81' },
      col3: { in: '41', cm: '104' },
      col4: { in: '41', cm: '104' },
    },
    {
      size: 'XL',
      col1: { in: '40', cm: '101' },
      col2: { in: '34', cm: '86' },
      col3: { in: '43', cm: '109' },
      col4: { in: '42', cm: '106' },
    },
    {
      size: 'XXL',
      col1: { in: '42', cm: '106' },
      col2: { in: '36', cm: '91' },
      col3: { in: '45', cm: '114' },
      col4: { in: '43', cm: '109' },
    },
  ];

  // Men's apparel size data
  const menClothingSizes: SizeRow[] = [
    {
      size: 'S',
      col1: { in: '38', cm: '96' },
      col2: { in: '30', cm: '76' },
      col3: { in: '17.5', cm: '44.5' },
      col4: { in: '27.5', cm: '70' },
    },
    {
      size: 'M',
      col1: { in: '40', cm: '101' },
      col2: { in: '32', cm: '81' },
      col3: { in: '18.0', cm: '45.7' },
      col4: { in: '28.5', cm: '72' },
    },
    {
      size: 'L',
      col1: { in: '42', cm: '106' },
      col2: { in: '34', cm: '86' },
      col3: { in: '18.5', cm: '47.0' },
      col4: { in: '29.5', cm: '75' },
    },
    {
      size: 'XL',
      col1: { in: '44', cm: '112' },
      col2: { in: '36', cm: '91' },
      col3: { in: '19.0', cm: '48.3' },
      col4: { in: '30.5', cm: '77' },
    },
    {
      size: 'XXL',
      col1: { in: '46', cm: '117' },
      col2: { in: '38', cm: '96' },
      col3: { in: '19.5', cm: '49.5' },
      col4: { in: '31.5', cm: '80' },
    },
  ];

  // Footwear size chart
  const footwearSizes = [
    { uk: 'UK 6', us: 'US 7', eu: 'EU 40', lengthIn: '9.8 in', lengthCm: '25.0 cm' },
    { uk: 'UK 7', us: 'US 8', eu: 'EU 41', lengthIn: '10.2 in', lengthCm: '26.0 cm' },
    { uk: 'UK 8', us: 'US 9', eu: 'EU 42', lengthIn: '10.6 in', lengthCm: '27.0 cm' },
    { uk: 'UK 9', us: 'US 10', eu: 'EU 43', lengthIn: '11.0 in', lengthCm: '28.0 cm' },
    { uk: 'UK 10', us: 'US 11', eu: 'EU 44', lengthIn: '11.4 in', lengthCm: '29.0 cm' },
    { uk: 'UK 11', us: 'US 12', eu: 'EU 45', lengthIn: '11.8 in', lengthCm: '30.0 cm' },
  ];

  const clothingColumns = isMen
    ? {
        col1Name: 'Chest',
        col2Name: 'Waist',
        col3Name: 'Shoulder',
        col4Name: 'Length',
      }
    : {
        col1Name: 'Bust',
        col2Name: 'Waist',
        col3Name: 'Hip',
        col4Name: 'Length',
      };

  const currentClothingRows = isMen ? menClothingSizes : womenClothingSizes;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Size & Fit Guide</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {product.category}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {product.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Unit Control Bar */}
        <div className="flex items-center justify-between pt-3 pb-2 gap-2">
          {/* Sub-tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Measurements Chart
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('howToMeasure')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'howToMeasure'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              How to Measure
            </button>
          </div>

          {/* Unit Toggle (Inches vs Centimeters) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                unit === 'in'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              IN
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                unit === 'cm'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 py-2 pr-1 space-y-4">
          {activeTab === 'table' ? (
            <>
              {/* Notice Tip */}
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 text-[11px] text-pink-700 dark:text-pink-300">
                <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-pink-500" />
                <span>
                  Tap any size row below to quickly select it for your order. Measurements shown in{' '}
                  <strong className="uppercase">{unit === 'in' ? 'Inches (in)' : 'Centimeters (cm)'}</strong>.
                </span>
              </div>

              {/* Sizing Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                {isFootwear ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">UK / India</th>
                        <th className="py-2.5 px-3">US Size</th>
                        <th className="py-2.5 px-3">EU Size</th>
                        <th className="py-2.5 px-3">Foot Length</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {footwearSizes.map((row) => {
                        const isCurrent =
                          selectedSize.toLowerCase() === row.uk.toLowerCase() ||
                          selectedSize.toLowerCase() === row.uk.replace('uk ', '').toLowerCase();
                        return (
                          <tr
                            key={row.uk}
                            onClick={() => onSelectSize(row.uk)}
                            className={`cursor-pointer transition-colors ${
                              isCurrent
                                ? 'bg-pink-50/80 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-semibold'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-bold">{row.uk}</td>
                            <td className="py-2.5 px-3">{row.us}</td>
                            <td className="py-2.5 px-3">{row.eu}</td>
                            <td className="py-2.5 px-3">
                              {unit === 'in' ? row.lengthIn : row.lengthCm}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {isCurrent ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-100 dark:bg-pink-900/60 px-2 py-0.5 rounded-full">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>Selected</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-medium">Select</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">
                          {clothingColumns.col1Name} ({unit})
                        </th>
                        <th className="py-2.5 px-3">
                          {clothingColumns.col2Name} ({unit})
                        </th>
                        <th className="py-2.5 px-3">
                          {clothingColumns.col3Name} ({unit})
                        </th>
                        {clothingColumns.col4Name && (
                          <th className="py-2.5 px-3">
                            {clothingColumns.col4Name} ({unit})
                          </th>
                        )}
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {currentClothingRows.map((row) => {
                        const isCurrent = selectedSize.toUpperCase() === row.size.toUpperCase();
                        return (
                          <tr
                            key={row.size}
                            onClick={() => onSelectSize(row.size)}
                            className={`cursor-pointer transition-colors ${
                              isCurrent
                                ? 'bg-pink-50/80 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-semibold'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                              {row.size}
                            </td>
                            <td className="py-2.5 px-3">{row.col1[unit]}</td>
                            <td className="py-2.5 px-3">{row.col2[unit]}</td>
                            <td className="py-2.5 px-3">{row.col3[unit]}</td>
                            {row.col4 && <td className="py-2.5 px-3">{row.col4[unit]}</td>}
                            <td className="py-2.5 px-3 text-right">
                              {isCurrent ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-100 dark:bg-pink-900/60 px-2 py-0.5 rounded-full">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>Selected</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-medium">Select</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Fit Recommendation Card */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs">
                <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Fit Recommendation: Regular Fit
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    This item fits true to size. If you fall between two sizes or prefer a slightly relaxed or oversized silhouette, we recommend choosing one size up.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* How to measure guide */
            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-pink-500" />
                  <span>How to Take Your Measurements</span>
                </h5>

                {isFootwear ? (
                  <div className="flex flex-col gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-pink-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <p>
                        <strong>Foot Length:</strong> Place a sheet of paper on the floor against a wall. Stand upright on it with your heel touching the wall.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-pink-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <p>
                        Mark the longest point of your toe on the paper and measure the distance from the edge to the mark in centimeters or inches.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-pink-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <p>
                        <strong>{isMen ? 'Chest' : 'Bust'}:</strong> Measure around the fullest part of your {isMen ? 'chest' : 'bust'}, keeping the measuring tape parallel to the floor.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-pink-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <p>
                        <strong>Waist:</strong> Wrap the tape around your natural waistline, usually above the belly button. Do not pull the tape too tight.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-pink-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <p>
                        <strong>{isMen ? 'Shoulder' : 'Hips'}:</strong>{' '}
                        {isMen
                          ? 'Measure across the back from the tip of one shoulder bone to the other.'
                          : 'Stand with your feet together and measure around the fullest part of your hips.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span>Selected size:</span>
            <span className="font-black text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-2 py-0.5 rounded-md">
              {selectedSize}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Confirm & Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
