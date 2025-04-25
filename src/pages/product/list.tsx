import React, { useEffect, useRef } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import Breadcrumb from "../../components/breadcrums";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";


import { Link } from 'react-router-dom';

const Product_List: React.FC = () => {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gridRef.current) {
            new Grid({
                columns: [
                    { name: "#", width: "10px" },
                    {
                        name: "Product name ",
                        width: "300px",
                       
                    },

                   
                    
                    { name: "Product price", width: "150px" },
                    { name: "Product stock ", width: "200px" },
                    
                    {
                        name: "Actions",
                        width: "160px",
                        formatter: () =>
                            html(`
                                <div class="flex justify-center gap-2">
                                    <button class="bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center">
                                        <i class="ri-pencil-line mr-1"></i> 
                                        <span class="px-1">Edit</span>
                                    </button>
                                    <button class="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center">
                                        <i class="ri-delete-bin-line mr-1"></i> 
                                         <span class="px-1">Delete</span>
                                    </button>
                                </div>
                            `),
                    },
                ],
                pagination: { limit: 10 },
                search: true,
                sort: true,
                data: [

                    ...[
                        ["Liter Brazilian Botox", "1000", "4252"],
                        ["Keratin Brazilian", "564", "374"],
                        ["Maxin Hair Condationer", "964", "234"],
                        ["Pagoda Cold Wave Lotion", "786", "123"],
                        ["Bremod Rebonding", "999", "545"],
                        ["Hortaleza Vaciador", "899", "24"],
                        ["Lightness Perm Lotion", "279", "67"],
                        ["Vitress Culticle", "699", "98"],
                        ["Alphaplex", "344", "56"],
                        ["Hair Color", "128", "896"],
                        ["Hair Growth Shampoo", "299", "86"],
                        ["Sytlish Hair Polish", "199", "56"],
                        ["Texture Cream", "254", "67"],
                        
                         
                    ].map((row, index) => [(index + 1) + ".", ...row]),
                ],
            }).render(gridRef.current);
        }
    }, []);
    return (
        <>
            <Header />
            <Sidemenu />
            <div className="main-content app-content">
                <div className="container-fluid">
                    <Breadcrumb
                        title="Manage Product"
                        links={[
                            { text: "Dashboard", link: "/products" },
                        ]}
                        active="products"
                        buttons={
                            <Link to="/product/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
                                <i className="ri-add-line"></i> Add Products
                            </Link>
                        }
                    />

                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xxl:col-span-12 col-span-12">
                            <div className="box overflow-hidden main-content-card">
                                <div className="box-body p-5">
                                    <div ref={gridRef}></div> {/* Grid.js Table Here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};  

export default Product_List;
