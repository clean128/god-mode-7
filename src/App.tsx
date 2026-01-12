import { useAppStore } from './stores/appStore';
import Map from './components/Map/Map';
import BusinessSearch from './components/BusinessSearch/BusinessSearch';
import FilterPanel from './components/FilterPanel/FilterPanel';
import PersonDetailModal from './components/PersonDetailModal/PersonDetailModal';
import SelectionSummary from './components/SelectionSummary/SelectionSummary';
import GiftSelectionModal from './components/GiftSelectionModal/GiftSelectionModal';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import NotificationContainer from './components/Notifications/NotificationContainer';
import LoadingOverlay from './components/LoadingOverlay/LoadingOverlay';

function App() {
  const isLoading = useAppStore((state) => state.isLoading);
  const showFilters = useAppStore((state) => state.showFilters);
  const selectedPerson = useAppStore((state) => state.selectedPerson);
  const showGiftSelection = useAppStore((state) => state.showGiftSelection);
  const showOrderConfirmation = useAppStore((state) => state.showOrderConfirmation);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-game-bg">
      {/* Header with Business Search */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 animate-slide-in-top">
        <div className="max-w-2xl mx-auto">
          <BusinessSearch />
        </div>
      </div>

      {/* Main Map */}
      <Map />

      {/* Filter Panel (Sidebar - Desktop) or (Full Screen - Mobile) */}
      {showFilters && (
        <div className="absolute md:top-20 md:right-4 md:bottom-4 top-0 left-0 right-0 bottom-0 z-20 md:w-96 w-full animate-slide-in-bottom">
          <FilterPanel />
        </div>
      )}

      {/* Selection Summary (Bottom Bar) */}
      <SelectionSummary />

      {/* Person Detail Modal */}
      {selectedPerson && <PersonDetailModal />}

      {/* Gift Selection Modal (Milestone 3) */}
      {showGiftSelection && <GiftSelectionModal />}

      {/* Order Confirmation Modal (Milestone 3) */}
      {showOrderConfirmation && <OrderConfirmation />}

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}

export default App;

