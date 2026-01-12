import { useAppStore } from '../../stores/appStore';
import {
  X,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Home,
  Users,
  Briefcase,
  Heart,
  CheckCircle,
  Circle,
} from 'lucide-react';

export default function PersonDetailModal() {
  const selectedPerson = useAppStore((state) => state.selectedPerson);
  const setSelectedPerson = useAppStore((state) => state.setSelectedPerson);
  const selectedPeople = useAppStore((state) => state.selectedPeople);
  const togglePersonSelection = useAppStore((state) => state.togglePersonSelection);

  if (!selectedPerson) return null;

  const isSelected = !!selectedPeople[selectedPerson.id];

  const handleClose = () => {
    setSelectedPerson(null);
  };

  const handleSelect = () => {
    togglePersonSelection(selectedPerson);
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 p-3 bg-game-bg/30 rounded-lg">
        <Icon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-sm font-semibold text-white truncate">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div
          className="glass-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto animate-slide-in-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-game-panel/95 backdrop-blur-md border-b border-game-border p-6 flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedPerson.fullName || `${selectedPerson.firstName} ${selectedPerson.lastName}`}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {selectedPerson.age && <span>Age: {selectedPerson.age}</span>}
                {selectedPerson.gender && <span>•</span>}
                {selectedPerson.gender && (
                  <span>{selectedPerson.gender === 'M' ? 'Male' : selectedPerson.gender === 'F' ? 'Female' : 'Unknown'}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-game-bg rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow icon={MapPin} label="Address" value={selectedPerson.address} />
                <InfoRow icon={MapPin} label="Zip Code" value={selectedPerson.zipCode} />
                <InfoRow icon={Phone} label="Phone" value={selectedPerson.phone} />
                <InfoRow icon={Mail} label="Email" value={selectedPerson.email} />
              </div>
            </div>

            {/* Financial Information */}
            {(selectedPerson.estimatedIncome || selectedPerson.netWorth || selectedPerson.homeValue) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Financial Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InfoRow icon={DollarSign} label="Estimated Income" value={selectedPerson.estimatedIncome} />
                  <InfoRow icon={DollarSign} label="Net Worth" value={selectedPerson.netWorth} />
                  <InfoRow icon={Home} label="Home Value" value={selectedPerson.homeValue} />
                </div>
              </div>
            )}

            {/* Household Information */}
            {(selectedPerson.maritalStatus || selectedPerson.householdSize || selectedPerson.childrenPresent !== undefined) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Household</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InfoRow icon={Users} label="Household Size" value={selectedPerson.householdSize} />
                  <InfoRow icon={Heart} label="Marital Status" value={selectedPerson.maritalStatus} />
                  {selectedPerson.childrenPresent !== undefined && (
                    <div className="flex items-start gap-3 p-3 bg-game-bg/30 rounded-lg">
                      <Users className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Children</p>
                        <p className="text-sm font-semibold text-white">
                          {selectedPerson.childrenPresent ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Information */}
            {(selectedPerson.occupation || selectedPerson.businessOwner !== undefined) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Professional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow icon={Briefcase} label="Occupation" value={selectedPerson.occupation} />
                  {selectedPerson.businessOwner !== undefined && (
                    <div className="flex items-start gap-3 p-3 bg-game-bg/30 rounded-lg">
                      <Briefcase className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Business Owner</p>
                        <p className="text-sm font-semibold text-white">
                          {selectedPerson.businessOwner ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedPerson.homeowner !== undefined && (
                    <div className="flex items-start gap-3 p-3 bg-game-bg/30 rounded-lg">
                      <Home className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Homeowner</p>
                        <p className="text-sm font-semibold text-white">
                          {selectedPerson.homeowner ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interests */}
            {selectedPerson.interests && selectedPerson.interests.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPerson.interests.map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-600/20 border border-primary-600/50 rounded-full text-sm text-primary-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-game-panel/95 backdrop-blur-md border-t border-game-border p-6 flex items-center justify-between gap-4">
            <button
              onClick={handleClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
            <button
              onClick={handleSelect}
              className={`
                flex-1 flex items-center justify-center gap-2
                ${isSelected ? 'btn-secondary' : 'btn-primary'}
              `}
            >
              {isSelected ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Selected
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5" />
                  Select for Gift
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
