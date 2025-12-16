import Dashboard from '@/components/Dashboard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Fuel Price Analytics | Petrol & Diesel RSP in Metro Cities</title>
        <meta
          name="description"
          content="Analyze monthly average Retail Selling Prices (RSP) of Petrol and Diesel across major Indian metro cities - Delhi, Mumbai, Chennai, and Kolkata."
        />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default Index;
