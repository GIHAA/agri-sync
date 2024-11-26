import React, { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import Breadcrumb from "../../base-components/Breadcrumb"; 
import QrScanner from "react-qr-scanner";
import axios from "axios";
import loginbackground from "../../assets/images/fakers/image-4.jpg";

interface FarmerDetails {
  name: string;
  email: string;
  mobile_number: string;
  location: string;
}

const Scanner = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [farmerDetails, setFarmerDetails] = useState<FarmerDetails | null>(null);

  // Handle QR Code scan result
  const handleScan = async (result: string | null) => {
    if (result) {
      setIsLoading(true);
      try {
        // Call backend to fetch farmer details by QR code
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API}/farmers/${result}`
        );

        if (response.data.success) {
          setFarmerDetails(response.data.data);
          toast.success("Farmer details fetched successfully!");
        } else {
          toast.error(response.data.message || "Farmer not found.");
          setFarmerDetails(null);
        }
      } catch (error) {
        console.error("Error fetching farmer details:", error);
        toast.error("Failed to fetch farmer details.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleError = (error: any) => {
    console.error("QR Scanner Error:", error);
    toast.error("QR Scanner Error");
  };

  const previewStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
    border: "2px solid #ccc",
    marginTop: "20px",
  };

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="relative z-[51] flex h-[67px] items-center border-b border-slate-200">
        <div className="relative mr-3 flex items-center justify-between">
          <Breadcrumb className="-intro-x mr-auto hidden sm:flex">
            <Breadcrumb.Link to="/">Home</Breadcrumb.Link>
            <Breadcrumb.Link to="/scanner" active>
              QR Code Scanner
            </Breadcrumb.Link>
          </Breadcrumb>

          {/* You can add your profile, notifications, etc., here if needed */}
        </div>
      </div>

      {/* BEGIN: Main Content */}
      <div
        style={{
          backgroundImage: `url(${loginbackground})`,
          minHeight: "100vh",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="py-10 px-5"
      >
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl w-full">
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
            QR Code Scanner
          </h1>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={(result: { text: string } | null) =>
              handleScan(result?.text || null)
            }
            style={previewStyle}
          />
          {farmerDetails && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">
                Farmer Details
              </h2>
              <p>
                <strong>Name:</strong> {farmerDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {farmerDetails.email}
              </p>
              <p>
                <strong>Mobile:</strong> {farmerDetails.mobile_number}
              </p>
              <p>
                <strong>Location:</strong> {farmerDetails.location}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner />
        </div>
      )}

      {/* Optional Footer */}
      {/* <Footer /> */}
    </>
  );
};

export default Scanner;
