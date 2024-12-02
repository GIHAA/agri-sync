import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner";
import Breadcrumb from "../../base-components/Breadcrumb";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import {
  PreviewComponent,
  Preview,
} from '../../components/common/preview-component'
import { Icons } from '../../constants';
import {
  InputElement,
  TextareaElement,
  DateElement,
  SelectElement,
} from '../../components/common/form-elements'

import Button from '../../components/common/button'
import SharedDataContainer from '../../containers/sharedData';
import { NotificationTypes } from "../../constants";
import Toast from '../../utils/notification';

const schema = yup.object({
  name: yup.string().required().min(2),
  seedType: yup.string().required(),
  quantity: yup
    .number()
    .required()
    .positive()
    .integer(),
  pricePerUnit: yup
    .number()
    .required()
    .positive(),
  location: yup.string().required(),
}).required();

const QRScanner = () => {
  const [date, setDate] = useState("");
  const [farmerDetails, setFarmerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setNotification } = SharedDataContainer.useContainer();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    console.log("Farmer details:", farmerDetails);
    setLoading(true);

    try {

      if (!farmerDetails?.id) {
        toast.error("Farmer details are missing.");
        return;
      }
      const response = await axios.post("http://localhost:3045/seed-transactions", {
        farmerId: farmerDetails?.id,
        seedType: data.seedType,
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        location: data.location,
        blockchainTxId: 'IX321-102-122-3238479894839439832023021'
      });

      console.log("API response:", response);

      if (response.data.success) {
        toast.success("Seed transaction created/updated successfully.");
      } else {
        toast.error("Failed to create/update seed transaction.");
      }
    } catch (error) {
      console.error("Error creating/updating seed transaction:", error);
      toast.error("Failed to create/update seed transaction.");
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
          message: 'The QR code you scanned does not appear to be valid. Please try again or contact support.',
          icon: Icons.QRCODE,
          type: NotificationTypes.ERROR,
        });


        Toast();

        return;
      }

      setIsLoading(true);

      axios
        .get(`http://localhost:9000/auth/farmers/${scannedText}`)
        .then((res) => {
          if (res.data.success) {

            setNotification({
              title: 'Farmer details fetched successfully!',
              message: `Enter the seed data and submit`,
              icon: Icons.QRCODE,
              type: NotificationTypes.WARNING,
            });

            setFarmerDetails(res.data.data);
            setValue("name", res.data.data.name);
            setValue("location", res.data.data.location);
            toast.success("Farmer details fetched successfully!");
          } else {
            setNotification({
              title: 'Farmer Not Found',
              message: `No data available for this QR code. Please check the code or contact support.`,
              icon: Icons.QRCODE,
              type: NotificationTypes.WARNING,
            });

            Toast();
            setFarmerDetails(null);
          }
        })
        .catch((err) => {
          console.error("Error fetching farmer details:", err);

          setNotification({
            title: 'Network Error',
            message: `Failed to fetch farmer details. Please try again later or check your connection.`,
            icon: Icons.QRCODE,
            type: NotificationTypes.ERROR,
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
            <form onSubmit={handleSubmit(onSubmit)} className="validate-form">
              <PreviewComponent className="intro-y box">
                <div className="p-5">
                  <Preview>
                    <div className="input-form">
                      {/* Name */}
                      <InputElement
                        label="Farmer Name"
                        register={register}
                        name="name"
                        placeholder="Farmer Name"
                        id="name"
                        //error={errors.name}
                        readOnly
                      />

                      {/* Age
                      <InputElement
                        label="Farmer Age"
                        register={register}
                        name="age"
                        placeholder="Farmer Age"
                        id="age"
                        error={errors.age}
                        type="number"
                      /> */}

                      {/* Comments
                      <TextareaElement
                        label="Comments"
                        register={register}
                        required
                        name="comment"
                        placeholder="Comment"
                        id="comment"
                        error={errors.comment}
                      /> */}

                      {/* Date of Birth
                      <DateElement
                        label="DOB"
                        name="dob"
                        placeholder="Farmer DOB"
                        id="dob"
                        error={errors.dob}
                        required
                        value={date}
                        onChange={setDate}
                      /> */}

                      {/* Seed Type */}
                      <SelectElement
                        label="Seed Type"
                        register={register}
                        name="seedType"
                        options={seedTypes}
                        id="seedType"
                        error={errors.seedType}
                        required
                      />

                      {/* Quantity */}
                      <InputElement
                        label="Quantity"
                        register={register}
                        name="quantity"
                        placeholder="Quantity"
                        id="quantity"
                        //error={errors.quantity}
                        type="number"
                      />

                      {/* Price Per Unit */}
                      <InputElement
                        label="Price per Unit"
                        register={register}
                        name="pricePerUnit"
                        placeholder="Price per Unit"
                        id="pricePerUnit"
                        //error={errors.pricePerUnit}
                        type="number"
                      />

                      {/* Location */}
                      <InputElement
                        label="Location"
                        register={register}
                        name="location"
                        placeholder="Location"
                        id="location"
                        //error={errors.location}
                      />
                    </div>

                    <Button type="submit" variant="primary" className="w-24 mt-5" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </Preview>
                </div>
              </PreviewComponent>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-lg font-semibold text-gray-700">
                Scan a QR Code to see Farmer's Details
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
