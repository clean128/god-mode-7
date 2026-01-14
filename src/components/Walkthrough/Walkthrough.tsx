import { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';
import { X, MapPin, Users, Gift, CheckCircle } from 'lucide-react';

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'top' | 'center' | 'bottom';
}

const steps: WalkthroughStep[] = [
  {
    id: 'search',
    title: 'Step 1: Find Your Business',
    description: 'Type your business name or address in the search box above. We\'ll find it on the map!',
    icon: <MapPin className="w-8 h-8" />,
    position: 'top',
  },
  {
    id: 'people',
    title: 'Step 2: See Your Customers',
    description: 'Click on the colorful pins to see people near your business. Each pin is a potential customer!',
    icon: <Users className="w-8 h-8" />,
    position: 'center',
  },
  {
    id: 'select',
    title: 'Step 3: Select People',
    description: 'Click "Select for Gift" on any person you want to send a gift to. You can select multiple people!',
    icon: <CheckCircle className="w-8 h-8" />,
    position: 'center',
  },
  {
    id: 'send',
    title: 'Step 4: Send Gifts',
    description: 'Click "Send Gifts" at the bottom to choose a gift and send it to all selected people!',
    icon: <Gift className="w-8 h-8" />,
    position: 'bottom',
  },
];

export default function Walkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const currentBusiness = useAppStore((state) => state.currentBusiness);
  const selectedPeople = useAppStore((state) => state.selectedPeople);
  const showGiftSelection = useAppStore((state) => state.showGiftSelection);

  // Auto-advance steps based on user progress
  useEffect(() => {
    if (!isVisible) return;

    if (currentStep === 0 && currentBusiness) {
      setTimeout(() => setCurrentStep(1), 1000);
    } else if (currentStep === 1 && currentBusiness && Object.keys(selectedPeople).length > 0) {
      setTimeout(() => setCurrentStep(3), 1000);
    } else if (currentStep === 3 && showGiftSelection) {
      setIsVisible(false);
    }
  }, [currentStep, currentBusiness, selectedPeople, showGiftSelection, isVisible]);

  if (!isVisible || currentStep >= steps.length) {
    return null;
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Step Card */}
      <div
        className={`
          absolute z-10 pointer-events-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-slide-in-bottom
        `}
      >
        <div className="glass-panel p-8 rounded-3xl border-4 border-primary-500 shadow-2xl max-w-md mx-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                {step.icon}
              </div>
              <div>
                <h3 className="text-2xl font-game-heading text-white mb-1">{step.title}</h3>
                <p className="text-sm text-primary-300 font-game-heading">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="w-10 h-10 rounded-full bg-game-bg/50 hover:bg-game-bg border border-game-border text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-lg text-white mb-6 leading-relaxed font-game-heading">
            {step.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-3 bg-game-bg rounded-full overflow-hidden border border-game-border">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 py-3 bg-game-bg border-2 border-game-border rounded-xl text-white font-semibold hover:bg-game-bg/70 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setIsVisible(false);
                }
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Got it!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

