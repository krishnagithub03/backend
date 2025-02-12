const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

const ConsultationPackage = () => {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setError('Payment system failed to load. Please refresh the page.');
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePurchase = async () => {
    if (!scriptLoaded) {
      setError('Payment system is not ready. Please wait or refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/payment/subscription/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 200000,
          currency: 'INR'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { data: order } = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'MGood',
        description: '8 Consultations Package',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('/api/payment/subscription/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            router.push('/success');
          } catch (error) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: 'Patient Name',
          email: 'patient@example.com',
          contact: '+91XXXXXXXXXX'
        },
        theme: {
          color: '#52B788'
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        setError(response.error.description);
      });
      
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="max-w-2xl mx-auto p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <button
        onClick={handlePurchase}
        disabled={loading || !scriptLoaded}
        className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : (scriptLoaded ? 'Purchase Package' : 'Loading payment system...')}
      </button>
    </div>
  );
};

export default ConsultationPackage;