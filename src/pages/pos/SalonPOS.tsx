import React, { useState, useEffect } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";
import { IoFlower } from "react-icons/io5";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import CategoryService, { Category } from "../../services/categoryService";
import ProductService, { Product } from "../../services/productService";
import SaleService from "../../services/SaleService";
import { toast } from "react-toastify";

interface CartItem {
  id: number;
  name: string;
  price: number;
  discount: number;
  total: number;
  checked: boolean;
  product_id?: number;
}

interface ServiceType {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string, paymentDetails: PaymentDetails) => void;
  grandTotal: string;
}

interface PaymentDetails {
  amountTendered?: string;
  referenceNumber?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  grandTotal,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [amountTendered, setAmountTendered] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [change, setChange] = useState<string>("0.00");

  useEffect(() => {
    if (paymentMethod === "cash" && amountTendered) {
      const tendered = parseFloat(amountTendered);
      const total = parseFloat(grandTotal);

      if (!isNaN(tendered) && tendered >= total) {
        setChange((tendered - total).toFixed(3));
      } else {
        setChange("0.000");
      }
    }
  }, [amountTendered, grandTotal, paymentMethod]);

  useEffect(() => {
    if (paymentMethod === "cash") {
      setReferenceNumber("");
    } else {
      setAmountTendered("");
      setChange("0.000");
    }
  }, [paymentMethod]);

  const handleConfirm = () => {
    console.log("Confirm button clicked");

    if (
      paymentMethod === "cash" &&
      (!amountTendered || parseFloat(amountTendered) < parseFloat(grandTotal))
    ) {
      console.log("Invalid amount tendered");
      toast.error(
        "Please enter a valid amount equal to or greater than the total"
      );
      return;
    }

    if (paymentMethod === "online" && !referenceNumber) {
      console.log("Missing reference number");
      toast.error("Please enter a reference number");
      return;
    }

    const paymentDetails =
      paymentMethod === "cash" ? { amountTendered } : { referenceNumber };

    console.log("Calling onConfirm with:", paymentMethod, paymentDetails);
    // Call the onConfirm function with payment method and details
    onConfirm(paymentMethod, paymentDetails);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Confirm Checkout</h3>

        <div className="mb-4">
          <p className="text-xl font-bold text-green-600">
            Total Amount: {grandTotal}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="cash">Cash</option>
            <option value="online">Gcash</option>
          </select>
        </div>

        {paymentMethod === "cash" ? (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Amount Tendered
            </label>
            <input
              type="number"
              step="0.01"
              min={grandTotal}
              value={amountTendered}
              onChange={(e) => setAmountTendered(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
            />

            {parseFloat(change) > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">Change</label>
                <input
                  type="text"
                  value={change}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Reference Number
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Gcash reference number"
            />
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleData: any;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  saleData,
}) => {
  if (!isOpen || !saleData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-center">Receipt</h3>

        <div className="border-t border-b py-2 mb-4">
          <p className="text-center">Invoice: {saleData.invoice_number}</p>
          <p className="text-center text-sm">
            {new Date(saleData.created_at).toLocaleString()}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Items:</h4>
          {saleData.sale_items &&
            saleData.sale_items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span>{item.product_name}</span>
                <span>{item.unit_price}</span>
              </div>
            ))}
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{saleData.sub_total}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>{saleData.total_discount}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{saleData.grand_total}</span>
          </div>
          <div className="mt-2 text-sm">
            <p>Payment Method: {saleData.payment_method}</p>
            {saleData.notes && <p>Notes: {saleData.notes}</p>}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Thank you for your business!</p>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SalonPOS: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [activeCategory, setActiveCategory] = useState<string>("");

  const [services, setServices] = useState<Record<string, ServiceType[]>>({});

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [noServicesFound, setNoServicesFound] = useState<boolean>(false);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] =
    useState<boolean>(false);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [completedSale, setCompletedSale] = useState<any>(null);

  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await CategoryService.getAllCategories();
        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
          setActiveCategory(fetchedCategories[0].id);
        } else {
          setCategories([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory) return;

      try {
        setLoading(true);
        setNoServicesFound(false);

        const products = await ProductService.getProducts(
          activeCategory,
          searchTerm
        );

        if (products && products.length > 0) {
          const transformedProducts = products.map((product) => ({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || "lotus",
          }));

          setServices((prev) => ({
            ...prev,
            [activeCategory]: transformedProducts,
          }));
        } else {
          setNoServicesFound(true);

          setServices((prev) => ({
            ...prev,
            [activeCategory]: [],
          }));
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
        setNoServicesFound(true);
      }
    };

    if (activeCategory) {
      fetchProducts();
    }
  }, [activeCategory, searchTerm]);

  const subTotal = cartItems
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(3);
  const totalDiscount = cartItems
    .reduce((sum, item) => sum + item.discount, 0)
    .toFixed(3);
  const grandTotal = (parseFloat(subTotal) - parseFloat(totalDiscount)).toFixed(
    3
  );

  const addToCart = (service: ServiceType) => {
    const newItem: CartItem = {
      id: Date.now(),
      name: service.name,
      price: Number(service.price),
      discount: 0,
      total: Number(service.price),
      checked: true,
      product_id: service.id,
    };
    setCartItems([...cartItems, newItem]);
  };

  const toggleItemCheck = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckout = () => {
    console.log("Checkout button clicked");
    if (cartItems.length === 0) {
      console.log("Cart is empty");
      toast.error("Your cart is empty!");
      return;
    }
    console.log("Opening checkout modal");
    setIsCheckoutModalOpen(true);
  };

  const processPayment = async (
    paymentMethod: string,
    paymentDetails: PaymentDetails
  ) => {
    setIsCheckoutModalOpen(false);
    setProcessing(true);

    try {
      const notes =
        paymentMethod === "cash"
          ? `Amount tendered: ${paymentDetails.amountTendered}`
          : `Reference number: ${paymentDetails.referenceNumber}`;

      const formattedCartItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        discount: item.discount,
        total: item.price - item.discount,
        product_id: item.product_id,
      }));

      console.log("Sending sale data to API:", {
        cart_items: formattedCartItems,
        sub_total: parseFloat(subTotal),
        total_discount: parseFloat(totalDiscount),
        grand_total: parseFloat(grandTotal),
        payment_method: paymentMethod,
        notes: notes,
      });

      const response = await SaleService.createSale({
        cart_items: formattedCartItems,
        sub_total: parseFloat(subTotal),
        total_discount: parseFloat(totalDiscount),
        grand_total: parseFloat(grandTotal),
        payment_method: paymentMethod,
        notes: notes,
      });

      console.log("API response:", response);

      setCompletedSale(response.sale);
      setIsReceiptModalOpen(true);

      setCartItems([]);

      toast.success(
        `Sale completed successfully! Invoice: ${response.invoice_number}`
      );
    } catch (error: any) {
      console.error("Payment processing failed:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        toast.error(
          `Failed to process payment: ${
            error.response.data?.message || "Server error"
          }`
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error(
          "Failed to process payment: No response from server. Check your network connection."
        );
      } else {
        console.error("Error message:", error.message);
        toast.error(`Failed to process payment: ${error.message}`);
      }

      console.error("Error config:", error.config);
    } finally {
      setProcessing(false);
    }
  };

  const handleHold = () => {
    alert("Sale has been put on hold");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this sale?")) {
      setCartItems([]);
    }
  };

  const formatPrice = (price: any): string => {
    const numPrice = Number(price);
    return !isNaN(numPrice) ? numPrice.toFixed(3) : "0.000";
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Point of Sale</h2>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
                <li className="inline-flex items-center">
                  <a href="#" className="text-gray-700 hover:text-blue-600">
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <a href="#" className="text-gray-700 hover:text-blue-600">
                      Sales
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500">Point of Sale</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col w-full">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type something here to search..."
                    className="w-full p-2 pl-8 rounded"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <FaSearch className="absolute left-2.5 top-3 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 flex flex-col border-r border-gray-200">
                  <div className="flex-grow flex flex-col overflow-auto">
                    <h3 className="px-4 py-2 bg-gray-100 font-medium text-gray-600">
                      Sales
                    </h3>

                    <div className="flex px-4 py-2 bg-pink-200 text-sm font-medium">
                      <div className="w-6"></div>
                      <div className="flex-1">Item</div>
                      {/* <div className="w-20 text-right">Unit Price</div> */}
                      {/* <div className="w-20 text-right">Item Discount</div> */}
                      <div className="w-16 text-right">Total</div>
                      <div className="w-8 text-center">Action</div>
                    </div>

                    <div className="flex-grow overflow-auto max-h-64">
                      {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center px-4 py-2 border-b border-gray-100 text-sm hover:bg-gray-50"
                          >
                            <div className="w-6">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleItemCheck(item.id)}
                                className="h-4 w-4"
                              />
                            </div>
                            <div className="flex-1 truncate">{item.name}</div>
                            {/* <div className="w-20 text-right">
                              {formatPrice(item.price)}
                            </div> */}
                            {/* <div className="w-20 text-right">
                              {formatPrice(item.discount)}
                            </div> */}
                            <div className="w-16 text-right">
                              {formatPrice(item.total)}
                            </div>
                            <div className="w-8 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item.id);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Cart is empty. Add items from the right panel.
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 border-t border-gray-200">
                      <div className="flex justify-between py-1">
                        <span>Sub Total</span>
                        <span>{subTotal}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Total Discount</span>
                        <span>{totalDiscount}</span>
                      </div>
                      <div className="flex justify-between py-1 font-bold">
                        <span>Invoice Cost</span>
                        <span>{grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-3/5 flex flex-col bg-gray-50">
                  <div className="bg-white p-2 flex flex-wrap gap-2 border-b border-gray-200 overflow-x-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`px-3 py-1.5 rounded text-sm whitespace-nowrap ${
                          activeCategory === category.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex-grow p-4 overflow-auto">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      </div>
                    ) : noServicesFound ? (
                      <div className="flex flex-col justify-center items-center h-64">
                        <div className="text-gray-400 text-6xl mb-4">
                          <IoFlower />
                        </div>
                        <p className="text-gray-500 text-lg">
                          No services found
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Try selecting a different category or search term
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services[activeCategory] &&
                        services[activeCategory].length > 0 ? (
                          services[activeCategory].map((service) => (
                            <div
                              key={service.id}
                              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => addToCart(service)}
                            >
                              <div className="aspect-square bg-pink-100 flex items-center justify-center">
                                <IoFlower className="text-pink-500 text-5xl" />
                              </div>
                              <div className="p-3 text-center">
                                <p className="text-xs font-medium mb-1">
                                  {service.name}
                                </p>
                                <p className="text-sm font-bold text-gray-800">
                                  ₱ {formatPrice(service.price)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-3 flex justify-center items-center h-64">
                            <p className="text-gray-500">
                              No services available for this category
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-2 flex justify-between">
                <div>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded mr-2"
                    onClick={handleHold}
                  >
                    Hold
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <button
                    className={`bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded ${
                      processing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || processing}
                  >
                    {processing ? "Processing..." : "Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={processPayment}
        grandTotal={grandTotal}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        saleData={completedSale}
      />
    </>
  );
};

export default SalonPOS;
