import NotificationListener from './components/NotificationListener';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <NotificationListener />
            {/* ...existing routes... */}
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
