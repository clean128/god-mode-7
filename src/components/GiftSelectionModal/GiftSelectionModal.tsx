import { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';
import { sendosoApi } from '../../services/sendosoApi';
import { Gift, Person } from '../../types';
import GiftCatalog from '../GiftCatalog/GiftCatalog';
import { X, MessageSquare, Send, Loader } from 'lucide-react';

export default function GiftSelectionModal() {
  const selectedPeople = useAppStore((state) => state.selectedPeople);
  const closeGiftSelection = useAppStore((state) => state.closeGiftSelection);
  const addNotification = useAppStore((state) => state.addNotification);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const clearSelection = useAppStore((state) => state.clearSelection);
  const createOrder = useAppStore((state) => state.createOrder);

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingGifts, setIsLoadingGifts] = useState(true);

  const selectedCount = Object.keys(selectedPeople).length;
  const recipients: Person[] = Object.values(selectedPeople);

  useEffect(() => {
    loadGiftCatalog();
  }, []);

  const loadGiftCatalog = async () => {
    setIsLoadingGifts(true);
    try {
      const catalog = await sendosoApi.getGiftCatalog();
      setGifts(catalog);
    } catch (error) {
      console.error('Failed to load gift catalog:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load gift catalog. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsLoadingGifts(false);
    }
  };

  const handleSendGifts = async () => {
    if (!selectedGift) {
      addNotification({
        type: 'warning',
        message: 'Please select a gift first',
        duration: 3000,
      });
      return;
    }

    setIsSending(true);
    setIsLoading(true);

    try {
      const order = await sendosoApi.sendGift(selectedGift, recipients, message || undefined);
      
      // Save order to store (this automatically opens order confirmation)
      createOrder(order);

      // Show success notification
      addNotification({
        type: 'success',
        message: `Successfully sent ${selectedCount} gift${selectedCount > 1 ? 's' : ''}!`,
        duration: 5000,
      });

      // Clear selection after order is created
      // (In Milestone 4, we might keep selection until payment is confirmed)
      clearSelection();

      // Note: createOrder() automatically opens order confirmation and closes gift selection modal
    } catch (error: any) {
      console.error('Failed to send gifts:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Failed to send gifts. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const totalPrice = selectedGift ? selectedGift.price * selectedCount : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col animate-slide-in-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-game-border">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Send Gifts</h2>
            <p className="text-sm text-gray-400">
              {selectedCount} {selectedCount === 1 ? 'person' : 'people'} selected
            </p>
          </div>
          <button
            onClick={closeGiftSelection}
            className="p-2 hover:bg-game-bg/50 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Gift Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Choose a Gift</h3>
            <GiftCatalog
              gifts={gifts}
              selectedGift={selectedGift}
              onSelectGift={setSelectedGift}
              isLoading={isLoadingGifts}
            />
          </div>

          {/* Message Composition */}
          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <MessageSquare className="w-5 h-5" />
              Personal Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message that will be included with each gift..."
              className="w-full h-32 px-4 py-3 bg-game-bg border border-game-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                This message will be sent with each gift
              </p>
              <p className="text-xs text-gray-500">
                {message.length}/500
              </p>
            </div>
          </div>

          {/* Recipients Preview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Recipients</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {recipients.map((person) => (
                <div
                  key={person.id}
                  className="px-3 py-2 bg-game-bg/50 rounded-lg border border-game-border"
                >
                  <p className="text-sm text-white">
                    {person.fullName || `${person.firstName} ${person.lastName}`.trim() || 'Unknown'}
                  </p>
                  {person.email && (
                    <p className="text-xs text-gray-400">{person.email}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Total and Actions */}
        <div className="p-6 border-t border-game-border bg-game-bg/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400">Total Cost</p>
              <p className="text-3xl font-bold text-white">
                ${totalPrice.toFixed(2)}
              </p>
              {selectedGift && (
                <p className="text-xs text-gray-500 mt-1">
                  ${selectedGift.price.toFixed(2)} × {selectedCount} {selectedCount === 1 ? 'gift' : 'gifts'}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeGiftSelection}
                disabled={isSending}
                className="px-6 py-3 bg-game-bg border border-game-border rounded-lg text-white hover:bg-game-bg/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSendGifts}
                disabled={!selectedGift || isSending}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Gifts
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Payment will be processed in the next step (Milestone 4)
          </p>
        </div>
      </div>
    </div>
  );
}

