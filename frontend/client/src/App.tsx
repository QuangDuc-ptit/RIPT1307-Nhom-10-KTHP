import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // 1. Import thêm cái này
import { router } from './routes';

function App() {
  return (
    // 2. Bọc HelmetProvider ra ngoài RouterProvider
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;