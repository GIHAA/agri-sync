import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Spinner from "./Spinner";
import Breadcrumb from "../../base-components/Breadcrumb";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import Button from "../../components/common/button";
import SharedDataContainer from "../../containers/sharedData";
import { Icons } from "../../constants";
import Toast from "../../utils/notification";

// Define the Yup validation schema
const validationSchema = Yup.object().shape({
  seedType: Yup.string().required("Seed type is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be a positive number")
    .typeError("Quantity must be a number"),
  pricePerUnit: Yup.number()
    .required("Price per unit is required")
    .positive("Price per unit must be a positive number")
    .typeError("Price per unit must be a number"),
  location: Yup.string().required("Location is required"),
});

const QRScanner = () => {
  const [farmerDetails, setFarmerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setNotification } = SharedDataContainer.useContainer();

  // Set up useForm with Yup validation
  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    console.log("Farmer details:", farmerDetails);
    setLoading(true);

    try {
      if (!farmerDetails?.id) {
        setNotification({
          title: 'Farmer Details Missing',
          message: 'Please scan the QR code to fetch farmer details before submitting the form.',
          icon: Icons.ERROR,
          type: "error",
        });
        Toast();
        return;
      }

      const farmerId = String(farmerDetails?.id).trim();
      const seedType = String(data.seedType).trim();
      if (!seedType) {
        setNotification({
          title: 'Invalid Seed Type',
          message: 'Please select or enter a valid seed type.',
          icon: Icons.ERROR,
          type: "error",
        });
        Toast();
        return;
      }
      const blockchainResponse = await fetch("http://localhost:3000/api/seeds", {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Api-Key": "da26588c-c185-480e-b05a-c3371a6973f5",
        },
        body: JSON.stringify({
          farmerId: farmerId,
          SeedType: seedType,
          quantity: data.quantity,
          pricePerUnit: data.pricePerUnit,
          location: data.location,
        }),
      });

      if (blockchainResponse.ok) {
        const blockchainData = await axios.get(`http://localhost:3000/api/seeds/${farmerId}/${seedType}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Api-Key": "da26588c-c185-480e-b05a-c3371a6973f5",
          },
        })

        const transactionId = blockchainData.data.transections[0];
        console.log("Blockchain Transaction ID:", transactionId);

        const offChainResponse = await axios.post("http://localhost:3004/seed-transactions", {
          farmerId: farmerId,
          seedType: seedType,
          quantity: data.quantity,
          pricePerUnit: data.pricePerUnit,
          location: data.location,
          blockchainTxId: transactionId,
        });

        console.log("Off-Chain Response:", offChainResponse.data);
        if (offChainResponse.data.success) {
          setNotification({
            title: 'Transaction Success',
            message: 'Seed transaction has been successfully created/updated.',
            icon: Icons.SUCCESS,
            type: "success",
          });
          Toast();
          reset();
          window.location.reload();
        } else {
          throw new Error('Failed to create/update seed transaction in off-chain database.');
        }
      } else {
        throw new Error('Blockchain API failed to respond correctly.');
      }
    } catch (error) {
      console.error("Error creating/updating seed transaction:", error);
      setNotification({
        title: 'Transaction Failed',
        message: error.message || 'There was an error processing your request. Please try again later.',
        icon: Icons.ERROR,
        type: "error",
      });
      Toast();
    } finally {
      setLoading(false);
    }
  };


  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const scannedText = detectedCodes[0].rawValue;
      console.log("Scanned QR Code:", scannedText);

      if (!scannedText) {
        setNotification({
          title: 'Invalid QR Code',
          message: 'The QR code you scanned does not appear to be val id. Please try again or contact support.',
          icon: Icons.QRCODE,
          type: "error",
        });
        Toast();
        return;
      }

      setIsLoading(true);

      axios
        .get(`http://localhost:3007/auth/farmers/${scannedText}`)
        .then((res) => {
          if (res.data.success) {
            setNotification({
              title: 'Farmer Details Fetched',
              message: `Farmer's details have been successfully fetched. Please enter seed data.`,
              icon: Icons.QRCODE,
              type: "success",
            });
            setFarmerDetails(res.data.data);
            setValue("location", "Monaragal");
            setValue("seedType", "");
            setValue("quantity", "");
            setValue("pricePerUnit", "");
            Toast();
          } else {
            setNotification({
              title: 'Farmer Not Found',
              message: `No data available for this QR code. Please check the code or contact support.`,
              icon: Icons.QRCODE,
              type: "warning",
            });
            Toast();
            setFarmerDetails(null);
          }
        })
        .catch((err) => {
          console.error("Error fetching farmer details:", err);

          setNotification({
            title: 'Network Error',
            message: `Failed to fetch farmer details. Please try again...`,
            icon: Icons.QRCODE,
            type: "error",
          });
          Toast();
          setFarmerDetails(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleError = (error: any) => {
    console.error("QR Scanner Error:", error);
    toast.error("QR Scanner Error");
  };

  const previewStyle: React.CSSProperties = {
    width: "100%",
    height: "400px",
    borderRadius: "10px",
    border: "2px solid #ccc",
    marginTop: "20px",
  };

  const seedTypes = [
    { id: 1, name: "Wheat" },
    { id: 2, name: "Rice" },
    { id: 3, name: "Corn" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="relative z-[51] flex h-[67px] items-center border-b border-slate-200">
        <div className="relative mr-3 flex items-center justify-between">
          <Breadcrumb className="-intro-x mr-auto hidden sm:flex">
            <Breadcrumb.Link to="/scanner" active>QR Code Scanner</Breadcrumb.Link>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center p-6 bg-white rounded-xl shadow-lg">
        {/* QR Code Scanner - Left Side */}
        <div className="flex-1">
          <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">QR Code Scanner</h2>
          <Scanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
          />
        </div>

        {/* Farmer Details Form - Right Side */}
        <div className="flex-1 ml-6">
          {farmerDetails ? (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="space-y-4">
                <div className="input-form">
                  {/* Farmer Name (Read-Only) */}
                  <label htmlFor="username" className="text-gray-700 font-semibold">Farmer Name</label>
                  <input
                    name="username"
                    value={farmerDetails.username}
                    readOnly
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-plum"
                  />

                  {/* Seed Type */}
                  <label htmlFor="seedType" className="text-gray-700 font-semibold">Seed Type</label>
                  <Controller
                    name="seedType"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-plum"
                      >
                        <option value="">Select Seed Type</option>
                        {seedTypes.map((type) => (
                          <option key={type.id} value={type.name}>{type.name}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.seedType && <p className="text-red-500 text-sm">{errors.seedType.message}</p>}

                  {/* Quantity */}
                  <label htmlFor="quantity" className="text-gray-700 font-semibold">Quantity</label>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-plum"
                      />
                    )}
                  />
                  {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}

                  {/* Price per Unit */}
                  <label htmlFor="pricePerUnit" className="text-gray-700 font-semibold">Price per Unit</label>
                  <Controller
                    name="pricePerUnit"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-plum"
                      />
                    )}
                  />
                  {errors.pricePerUnit && <p className="text-red-500 text-sm">{errors.pricePerUnit.message}</p>}

                  {/* Location */}
                  <label htmlFor="location" className="text-gray-700 font-semibold">Location</label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-plum"
                      />
                    )}
                  />
                  {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button type="submit" variant="primary" className="w-24 mt-5" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              {isLoading ? <Spinner /> : <p>Please scan a QR code to fetch farmer details.</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QRScanner;




// import React, { useState } from "react";
// import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Spinner from "./Spinner";
// import Breadcrumb from "../../base-components/Breadcrumb";
// import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
// import { PreviewComponent, Preview } from '../../components/common/preview-component';
// import { Icons } from '../../constants';
// import { InputElement, SelectElement } from '../../components/common/form-elements';
// import Button from '../../components/common/button';
// import SharedDataContainer from '../../containers/sharedData';
// import { NotificationTypes } from "../../constants";
// import Toast from '../../utils/notification';

// // Define the type for the form data
// interface IFormInputs {
//   seedType: string;
//   quantity: string;
//   pricePerUnit: string;
//   location: string;
// }

// const QRScanner = () => {
//   const [farmerDetails, setFarmerDetails] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { setNotification } = SharedDataContainer.useContainer();

//   // Pass the correct type to useForm
//   const { register, handleSubmit, setValue, reset } = useForm<IFormInputs>({
//     mode: "onSubmit", // Validation is disabled
//     defaultValues: {
//       seedType: "",
//       quantity: "",
//       pricePerUnit: "",
//       location: ""
//     }
//   });

//   // Hardcoded blockchainTxId
//   const blockchainTxId = 'IX321-102-122-3238479894839439832023021';

//   // Handle form submission
//   const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
//     console.log("Form submitted:", data);

//     setLoading(true);
//     try {
//       if (!farmerDetails?.id) {
//         toast.error("Farmer details are missing.");
//         return;
//       }

//       const response = await axios.post("http://localhost:3045/seed-transactions", {
//         farmerId: farmerDetails?.id, // Submit only farmer ID
//         seedType: data.seedType,
//         quantity: data.quantity,
//         pricePerUnit: data.pricePerUnit,
//         location: data.location,
//         blockchainTxId: blockchainTxId // Use hardcoded blockchainTxId
//       });

//       if (response.data.success) {
//         toast.success("Seed transaction created/updated successfully.");
//         reset(); // Reset form after successful submission
//       } else {
//         toast.error("Failed to create/update seed transaction.");
//       }
//     } catch (error) {
//       console.error("Error creating/updating seed transaction:", error);
//       toast.error("Failed to create/update seed transaction.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle QR scan
//   const handleScan = (detectedCodes: IDetectedBarcode[]) => {
//     if (detectedCodes.length > 0) {
//       const scannedText = detectedCodes[0].rawValue;
//       console.log("Scanned QR Code:", scannedText);

//       if (!scannedText) {
//         setNotification({
//           title: 'Invalid QR Code',
//           message: 'The QR code you scanned does not appear to be valid. Please try again or contact support.',
//           icon: Icons.QRCODE,
//           type: NotificationTypes.ERROR,
//         });
//         Toast();
//         return;
//       }

//       setIsLoading(true);

//       axios
//         .get(`http://localhost:9000/auth/farmers/${scannedText}`)
//         .then((res) => {
//           if (res.data.success) {
//             setNotification({
//               title: 'Farmer details fetched successfully!',
//               message: `Enter the seed data and submit.`,
//               icon: Icons.QRCODE,
//               type: NotificationTypes.WARNING,
//             });

//             setFarmerDetails(res.data.data);
//             // Set the form values based on farmer data (excluding name, which is read-only)
//             setValue("location", res.data.data.location);
//             setValue("seedType", "Sodium"); // Default seed type
//             setValue("quantity", "100.50"); // Default quantity
//             setValue("pricePerUnit", "10.25"); // Default price per unit
//             toast.success("Farmer details fetched successfully!");
//           } else {
//             setNotification({
//               title: 'Farmer Not Found',
//               message: `No data available for this QR code. Please check the code or contact support.`,
//               icon: Icons.QRCODE,
//               type: NotificationTypes.WARNING,
//             });
//             Toast();
//             setFarmerDetails(null);
//           }
//         })
//         .catch((err) => {
//           console.error("Error fetching farmer details:", err);

//           setNotification({
//             title: 'Network Error',
//             message: `Failed to fetch farmer details. Please try again later or check your connection.`,
//             icon: Icons.QRCODE,
//             type: NotificationTypes.ERROR,
//           });
//           Toast();
//           setFarmerDetails(null);
//         })
//         .finally(() => {
//           setIsLoading(false);
//         });
//     }
//   };

//   const handleError = (error: any) => {
//     console.error("QR Scanner Error:", error);
//     toast.error("QR Scanner Error");
//   };

//   const previewStyle: React.CSSProperties = {
//     width: "100%",
//     height: "400px",
//     borderRadius: "10px",
//     border: "2px solid #ccc",
//     marginTop: "20px",
//   };

//   const seedTypes = [
//     { id: 1, name: "Wheat" },
//     { id: 2, name: "Rice" },
//     { id: 3, name: "Corn" },
//   ];

//   return (
//     <>
//       {/* Breadcrumb */}
//       <div className="relative z-[51] flex h-[67px] items-center border-b border-slate-200">
//         <div className="relative mr-3 flex items-center justify-between">
//           <Breadcrumb className="-intro-x mr-auto hidden sm:flex">
//             <Breadcrumb.Link to="/scanner" active>QR Code Scanner</Breadcrumb.Link>
//           </Breadcrumb>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex justify-center items-center p-6 bg-white rounded-xl shadow-lg">
//         {/* QR Code Scanner - Left Side */}
//         <div className="flex-1">
//           <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">QR Code Scanner</h2>
//           <Scanner
//             delay={300}
//             onError={handleError}
//             onScan={handleScan}
//             style={previewStyle}
//           />
//         </div>

//         {/* Farmer Details Form - Right Side */}
//         <div className="flex-1 ml-6">
//           {farmerDetails ? (
//             <form onSubmit={handleSubmit(onSubmit)} className="validate-form">
//               <PreviewComponent className="intro-y box">
//                 <div className="p-5">
//                   <Preview>
//                     <div className="input-form">
//                       {/* Name - Read-Only */}
//                       <InputElement
//                         label="Farmer Name"
//                         value={farmerDetails.name} // Display farmer name
//                         readOnly
//                         register={register} // Pass the register function
//                       />

//                       {/* Seed Type */}
//                       <SelectElement
//                         label="Seed Type"
//                         name="seedType"
//                         options={seedTypes}
//                         register={register} // Pass the register function
//                       />

//                       {/* Quantity */}
//                       <InputElement
//                         label="Quantity"
//                         name="quantity"
//                         type="number"
//                         register={register}
//                       />

//                       {/* Price Per Unit */}
//                       <InputElement
//                         label="Price per Unit"
//                         name="pricePerUnit"
//                         type="number"
//                         register={register}
//                       />

//                       {/* Location */}
//                       <InputElement
//                         label="Location"
//                         name="location"
//                         register={register}
//                       />
//                     </div>

//                     <Button type="submit" variant="primary" className="w-24 mt-5" disabled={loading}>
//                       {loading ? "Submitting..." : "Submit"}
//                     </Button>
//                   </Preview>
//                 </div>
//               </PreviewComponent>
//             </form>
//           ) : (
//             <div className="flex flex-col items-center justify-center">
//               <p className="text-center text-lg font-semibold text-gray-700">
//                 Scan a QR Code to see Farmer's Details
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Loading Spinner */}
//       {isLoading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <Spinner />
//         </div>
//       )}
//     </>
//   );
// };

// export default QRScanner;
