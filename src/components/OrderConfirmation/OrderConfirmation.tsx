import { useAppStore } from '../../stores/appStore';
import { sendosoApi } from '../../services/sendosoApi';
import { GiftOrder } from '../../types';
import { CheckCircle, X, Package, Calendar, Users } from 'lucide-react';

export default function OrderConfirmation() {
  const currentOrder = useAppStore((state) => state.currentOrder);
  const closeOrderConfirmation = useAppStore((state) => state.closeOrderConfirmation);

  if (!currentOrder) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: GiftOrder['status']) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'text-green-400';
      case 'processing':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: GiftOrder['status']) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'failed':
        return <X className="w-6 h-6 text-red-400" />;
      default:
        return <Package className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] mx-4 flex flex-col animate-slide-in-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-game-border">
          <div className="flex items-center gap-3">
            {getStatusIcon(currentOrder.status)}
            <div>
              <h2 className="text-2xl font-bold text-white">Order Confirmation</h2>
              <p className="text-sm text-gray-400">Order #{currentOrder.id.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={closeOrderConfirmation}
            className="p-2 hover:bg-game-bg/50 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-game-bg/50 rounded-lg border border-game-border">
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p className={`text-lg font-semibold ${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Order Date</p>
              <p className="text-lg font-semibold text-white">{formatDate(currentOrder.createdAt)}</p>
            </div>
          </div>

          {/* Gift Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Gift Details
            </h3>
            <div className="p-4 bg-game-bg/50 rounded-lg border border-game-border">
              <div className="flex gap-4">
                {currentOrder.gift.imageUrl && (
                  <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={currentOrder.gift.imageUrl}
                      alt={currentOrder.gift.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {currentOrder.gift.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {currentOrder.gift.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-primary-400 font-bold">
                      ${currentOrder.gift.price.toFixed(2)}
                    </span>
                    {currentOrder.gift.category && (
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        {currentOrder.gift.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {currentOrder.message && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Personal Message</h3>
              <div className="p-4 bg-game-bg/50 rounded-lg border border-game-border">
                <p className="text-white whitespace-pre-wrap">{currentOrder.message}</p>
              </div>
            </div>
          )}

          {/* Recipients */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recipients ({currentOrder.recipients.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentOrder.recipients.map((person) => (
                <div
                  key={person.id}
                  className="p-3 bg-game-bg/50 rounded-lg border border-game-border"
                >
                  <p className="text-sm font-medium text-white">
                    {person.fullName || `${person.firstName} ${person.lastName}`.trim() || 'Unknown'}
                  </p>
                  {person.email && (
                    <p className="text-xs text-gray-400">{person.email}</p>
                  )}
                  {person.address && (
                    <p className="text-xs text-gray-500 mt-1">{person.address}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Order Summary
            </h3>
            <div className="p-4 bg-game-bg/50 rounded-lg border border-game-border space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Unit Price</span>
                <span>${currentOrder.gift.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Quantity</span>
                <span>{currentOrder.recipients.length}</span>
              </div>
              <div className="border-t border-game-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-primary-400">
                    ${currentOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          {currentOrder.status === 'sent' && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400">
                <strong>Success!</strong> Your gifts have been sent. Recipients will receive email notifications.
                {sendosoApi.isConfigured() ? (
                  ' You will receive tracking information soon.'
                ) : (
                  ' (Using demo mode - no actual gifts were sent)'
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-game-border bg-game-bg/30">
          <button
            onClick={closeOrderConfirmation}
            className="w-full btn-primary"
          >
            Done
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            {sendosoApi.isConfigured() 
              ? 'Payment processing will be completed in Milestone 4'
              : 'Demo mode - No actual charges'}
          </p>
        </div>
      </div>
    </div>
  );
}

