import CategoryService, { Category } from "../../services/categoryService";
import ProductService, { Product } from "../../services/productService";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaFilter,
  FaPlus,
} from "react-icons/fa";

const AddProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    category: "",
    description: "",
    image: "lotus",
  });

  const [showProductModal, setShowProductModal] = useState<boolean>(false);

  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<Category>({
    id: "",
    name: "",
  });
  const [categoryEditMode, setCategoryEditMode] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string>("");

  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [productSubmitting, setProductSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCategories();
        await fetchProducts();
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Failed to load data. Please check console for details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data || []);
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again later.");

      setCategories([]);
      return [];
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getProducts(filter, searchTerm);
      setProducts(data || []);
      setFilteredProducts(data || []);
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");

      setProducts([]);
      setFilteredProducts([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productSubmitting) {
      fetchProducts();
    }
  }, [filter, searchTerm, productSubmitting]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      setCurrentProduct({
        ...currentProduct,
        [name]: value === "" ? 0 : parseFloat(value),
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !currentProduct.name ||
      !currentProduct.category ||
      currentProduct.price <= 0
    ) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    setProductSubmitting(true);
    setLoading(true);

    try {
      if (editMode) {
        await ProductService.updateProduct(currentProduct.id, {
          ...currentProduct,
        });
      } else {
        await ProductService.createProduct({ ...currentProduct });
      }

      await fetchProducts();

      resetForm();
      setShowProductModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product. Please try again.");
    } finally {
      // Always reset loading states
      setLoading(false);
      setProductSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditMode(true);

    setCurrentProduct({ ...product });
    setShowProductModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await ProductService.deleteProduct(id);
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setCurrentProduct({
      id: 0,
      name: "",
      price: 0,
      category: "",
      description: "",
      image: "lotus",
    });
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoryError("");

    if (!newCategory.name) {
      setCategoryError("Name is required");
      return;
    }

    setLoading(true);

    try {
      if (categoryEditMode) {
        await CategoryService.updateCategory(newCategory.id, {
          ...newCategory,
        });
      } else {
        await CategoryService.createCategory({ name: newCategory.name });
      }

      await fetchCategories();

      resetCategoryForm();
      setShowCategoryModal(false);
    } catch (error) {
      console.error("Error saving category:", error);
      setCategoryError("Failed to save category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setCategoryEditMode(true);
    setNewCategory({ ...category });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setLoading(true);
      await CategoryService.deleteCategory(id);
      await fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);

      if (error.response && error.response.status === 409) {
        alert(
          "Cannot delete category because it's being used by one or more products."
        );
      } else {
        alert("Failed to delete category. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryEditMode(false);
    setNewCategory({
      id: "",
      name: "",
    });
    setCategoryError("");
  };

  const handleAddNewProduct = () => {
    resetForm();
    setShowProductModal(true);
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Product Management</h2>
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
                      Inventory
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500">Product Management</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button
                onClick={() => setError("")}
                className="float-right"
                type="button"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Category Management</h3>
                  <button
                    onClick={() => {
                      resetCategoryForm();
                      setShowCategoryModal(true);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center text-sm"
                    type="button"
                    disabled={loading}
                  >
                    <FaPlus className="mr-1" /> Add Category
                  </button>
                </div>

                <div className="overflow-y-auto max-h-80">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category, index) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {category.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                              type="button"
                              disabled={loading}
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900"
                              type="button"
                              disabled={loading}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && !loading && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-4 text-center text-sm text-gray-500"
                          >
                            No categories found. Add a new category to get
                            started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {loading && (
                    <div className="p-4 text-center">Loading categories...</div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <FaFilter className="mr-2 text-gray-500" />
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          <option value="ALL">All Categories</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleAddNewProduct}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center text-sm"
                        type="button"
                        disabled={loading}
                      >
                        <FaPlus className="mr-1" /> Add Product
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-4 text-center">Loading products...</div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 bg-pink-100 flex items-center justify-center rounded-full">
                                    <span className="text-pink-600 text-lg">
                                      {product.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                      {product.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {categories.find(
                                    (c) => c.id === product.category
                                  )?.name || product.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₱{" "}
                                {typeof product.price === "number"
                                  ? product.price.toFixed(3)
                                  : (
                                      parseFloat(String(product.price)) || 0
                                    ).toFixed(3)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  type="button"
                                  disabled={loading || productSubmitting}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-600 hover:text-red-900"
                                  type="button"
                                  disabled={loading || productSubmitting}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No products found. Try a different search or
                              filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {filteredProducts.length}
                      </span>{" "}
                      of <span className="font-medium">{products.length}</span>{" "}
                      products
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editMode ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={productSubmitting}
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      resetCategoryForm();
                      setShowCategoryModal(true);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    disabled={productSubmitting}
                  >
                    <FaPlus className="mr-1" size={12} /> Add New Category
                  </button>
                </div>
                <select
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={productSubmitting}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₱)*
                </label>
                <input
                  type="number"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.001"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={productSubmitting}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={productSubmitting}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center"
                  disabled={productSubmitting}
                >
                  <FaTimes className="mr-1" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  disabled={productSubmitting}
                >
                  <FaSave className="mr-1" />{" "}
                  {productSubmitting
                    ? "Saving..."
                    : editMode
                    ? "Update"
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {categoryEditMode ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setShowCategoryModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleCategoryInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Makeup Products"
                  required
                />
              </div>

              {categoryError && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {categoryError}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    resetCategoryForm();
                    setShowCategoryModal(false);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : categoryEditMode
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;
