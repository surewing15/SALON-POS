
import Breadcrumb from "../../components/breadcrums";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import { useState, ChangeEvent, FormEvent } from "react";
import ProfileImage from "../../assets/avatar.png";

interface FormData {
    firstName: string;
    lastName: string;
    Business: string;
    email: string;
    Vendor_ID: string;
    Business_Type: string;
    Gender: string;
    Region: string;
    province: string;
    city: string;
    barangay: string;
    postalCode: string;
    photo?: File | null;
}

const initialFormData: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    Business: "",
    Vendor_ID: "",
    Business_Type: "",
    Gender: "",
    Region: "",
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
    photo: null,
};

function Product_Registration() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [imagePreview, setImagePreview] = useState<string>(ProfileImage);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
            setFormData({ ...formData, photo: file });
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(ProfileImage);
        setFormData({ ...formData, photo: null });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted", formData);
    };

    return (
        <>
            <Header />
            <Sidemenu />
            <div className="main-content app-content">
                <div className="container-fluid">

                    <Breadcrumb
                        title="Product Registration"
                        links={[
                            { text: "product", link: "/Product" },
                        ]}
                        active="Add Product "
                    />

                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xxl:col-span-12 col-span-12">
                            <div className="box overflow-hidden main-content-card">
                                <div className="box-body p-5">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4 flex items-start gap-4">
                                            <span className="avatar avatar-xxl">
                                                <img src={imagePreview} alt="Profile" id="profile-img" />
                                            </span>
                                            <div className="mt-2">
                                                <label className="block font-medium mb-2">Profile Picture</label>
                                                <div className="flex gap-2">
                                                    <label className="bg-gray-300 text-dark px-4 py-2 rounded cursor-pointer">
                                                        <i className="bi bi-upload"></i>
                                                        <span className="px-2">Upload</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                    </label>
                                                    <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={handleRemoveImage}>
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="mt-3 mb-4" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                
                                                ["Product Name", "Product Name", "bi bi-box-seam"],
                                                ["Product Price", "Price", "bi bi-currency-dollar"], 
                                                ["Product Stocks", "Stocks", "bi bi-box"],
                                                
                                            ].map(([label, name, icon, type = "text"]) => (
                                                <div key={name} className="relative">
                                                    <label className="block font-medium mb-1" htmlFor={name}>{label}</label>
                                                    <div className="relative">
                                                        <input type={type} id={name} name={name}
                                                            onChange={handleChange}
                                                            className="ti-form-input rounded-sm ps-11 focus:z-10"
                                                            placeholder={`Enter ${label}`} />
                                                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                                                            <i className={icon}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}


                                        
                                        </div>

                                        <div className="mt-4 flex justify-end gap-4">
                                            <button type="reset" className="bg-gray-300  px-4 py-2 rounded" onClick={() => setFormData(initialFormData)}>Reset</button>
                                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                                                <i className="bi bi-save"></i>
                                                <span className="px-3">Submit Product</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product_Registration;

