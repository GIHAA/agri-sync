/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
import clsx from 'clsx'
import { useState, useEffect, SetStateAction } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import { PosApi } from '../../../api'
import Button from '../../common/button'
import { Tab } from '../../common/headless'
import Lucide from '../../common/lucide'
import { InputElement } from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import {
  FormCheck,
  FormInfo,
  FormInput,
} from '../../common/form-elements/components'

function AddRole() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')

  const schema = yup
    .object({
      roleName: yup
        .string()
        .required(
          `${t('addUserManagementRoles.fields.roleName.validationMessage')}`
        ),
      prefix: yup.string().when('_', {
        is: () => 'toolagrisync',
        then: yup
          .string()
          .required(`${t('customerForm.fields.prefix.toolagrisync')}`),
        otherwise: yup.string().notRequired(),
      }),
    })
    .required()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sucessHandlerCreateCustomer = (customer: any, message: string) => {
    setNotification({
      title: '',
      message,
      icon: Icons.CHECKCIRCLE,
      type: NotificationTypes.SUCCESS,
    })
    Toast()
    setIsLoading(false)
    handleSlider()
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorHandler = (error: any) => {
    Toast()
    setNotification({
      title: '',
      message: error || 'Something went wrong.',
      icon: Icons.XCIRCLE,
      type: NotificationTypes.ERROR,
    })
    setIsLoading(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createCustomer = async (customer: any) => {
    setIsLoading(true)
    /* TODO: Remove after after set customer type */
    // eslint-disable-next-line no-param-reassign
    customer.type = 'both'
    const res = await posApi.createCustomer(customer)
    if (res) {
      const { data } = res
      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
      const { message, data: customer } = data
      sucessHandlerCreateCustomer(customer, message)
    } else {
      errorHandler(null)
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    createCustomer(data)
  }
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
  }
  const [selectedOption, setSelectedOption] = useState('')
  const [chatBox, setChatBox] = useState(true) // Initialize with true to hide the default chatbox

  const showChatBox = (option: SetStateAction<string>) => {
    setSelectedOption(option)
    setChatBox(false) // Set chatBox to false when a chat tab is clicked
  }

  const [isUserSelected, setIsUserSelected] = useState(false)
  const [isRolesSelected, setIsRolesSelected] = useState(false)
  const [isFixedComSelected, setIsFixedComSelected] = useState(false)
  const [isSupplierSelected, setIsSupplierSelected] = useState(false)
  const [isCustomerSelected, setIsCustomerSelected] = useState(false)
  const [isProductSelected, setIsProductSelected] = useState(false)
  const [isPurchaseSelected, setIsPurchaseSelected] = useState(false)
  const [isStockAdjustSelected, setIsStockAdjustSelected] = useState(false)
  const [isStockTransferSelected, setIsStockTransferSelected] = useState(false)
  const [isSellSelected, setIsSellSelected] = useState(false)
  const [isCashRegisterSelected, setIsCashRegisterSelected] = useState(false)
  const [isBrandSelected, setIsBrandSelected] = useState(false)
  const [isTaxRateSelected, setIsTaxRateSelected] = useState(false)
  const [isUnitSelected, setIsUnitSelected] = useState(false)
  const [isCategorySelected, setIsCategorySelected] = useState(false)
  const [isSettingsSelected, setIsSettingsSelected] = useState(false)
  const [isHomeSelected, setIsHomeSelected] = useState(false)
  const [isAccountsSelected, setIsAccountsSelected] = useState(false)
  const [
    isAccessSellingPriceGroupsSelected,
    setIsAccessSellingPriceGroupsSelected,
  ] = useState(false)
  const [isNotificationSelected, setIsNotificationSelected] = useState(false)
  const [isAssetManagementSelected, setIsAssetManagementSelected] =
    useState(false)
  const [isCODSelected, setIsCODSelected] = useState(false)
  const [isInternalIntegrationSelected, setIsInternalIntegrationSelected] =
    useState(false)
  const [isManufacturingSelected, setIsManufacturingSelected] = useState(false)
  const [isPromoCardSelected, setIsPromoCardSelected] = useState(false)
  const [isRepairSelected, setIsRepairSelected] = useState(false)
  const [isShopifySelected, setIsShopifySelected] = useState(false)
  const [isSuperadminSelected, setIsSuperadminSelected] = useState(false)
  const [isWoocommerceSelected, setIsWoocommerceSelected] = useState(false)
  const [isReportsSelected, setIsReportsSelected] = useState(false)
  const [selectedTab, setSelectedTab] = useState('')

  const handleUserClick = () => {
    setIsUserSelected(!isUserSelected)
    setIsRolesSelected(false)
    setSelectedTab('User')
  }

  const handleRolesClick = () => {
    setIsRolesSelected(!isRolesSelected)
    setIsRolesSelected(false)
    setSelectedTab('Roles')
  }
  const handleFixedComClick = () => {
    setIsFixedComSelected(!isFixedComSelected)
    setIsFixedComSelected(false)
    setSelectedTab('FixedCom')
  }
  const handleSupplierClick = () => {
    setIsSupplierSelected(!isSupplierSelected)
    setIsSupplierSelected(false)
    setSelectedTab('Supplier')
  }
  const handleCustomerClick = () => {
    setIsCustomerSelected(!isCustomerSelected)
    setIsCustomerSelected(false)
    setSelectedTab('Customer')
  }
  const handleProductClick = () => {
    setIsProductSelected(!isProductSelected)
    setIsProductSelected(false)
    setSelectedTab('Product')
  }
  const handlePurchaseClick = () => {
    setIsPurchaseSelected(!isPurchaseSelected)
    setIsPurchaseSelected(false)
    setSelectedTab('Purchase')
  }
  const handleStockAdjustClick = () => {
    setIsStockAdjustSelected(!isStockAdjustSelected)
    setIsStockAdjustSelected(false)
    setSelectedTab('StockAdjust')
  }
  const handleStockTransferClick = () => {
    setIsStockTransferSelected(!isStockTransferSelected)
    setIsStockTransferSelected(false)
    setSelectedTab('StockTransfer')
  }
  const handleSellClick = () => {
    setIsSellSelected(!isSellSelected)
    setIsSellSelected(false)
    setSelectedTab('Sell')
  }
  const handleCashRegisterClick = () => {
    setIsCashRegisterSelected(!isCashRegisterSelected)
    setIsCashRegisterSelected(false)
    setSelectedTab('CashRegister')
  }
  const handleBrandClick = () => {
    setIsBrandSelected(!isBrandSelected)
    setIsBrandSelected(false)
    setSelectedTab('Brand')
  }
  const handleTaxRateClick = () => {
    setIsTaxRateSelected(!isTaxRateSelected)
    setIsTaxRateSelected(false)
    setSelectedTab('TaxRate')
  }
  const handleUnitClick = () => {
    setIsUnitSelected(!isUnitSelected)
    setIsUnitSelected(false)
    setSelectedTab('Unit')
  }
  const handleCategoryClick = () => {
    setIsCategorySelected(!isCategorySelected)
    setIsCategorySelected(false)
    setSelectedTab('Category')
  }
  const handleSettingsClick = () => {
    setIsSettingsSelected(!isSettingsSelected)
    setIsSettingsSelected(false)
    setSelectedTab('Settings')
  }
  const handleHomeClick = () => {
    setIsHomeSelected(!isHomeSelected)
    setIsHomeSelected(false)
    setSelectedTab('Home')
  }
  const handleAccountsClick = () => {
    setIsAccountsSelected(!isAccountsSelected)
    setIsAccountsSelected(false)
    setSelectedTab('Accounts')
  }
  const handleAccessSellingPriceGroupsClick = () => {
    setIsAccessSellingPriceGroupsSelected(!isAccessSellingPriceGroupsSelected)
    setIsAccessSellingPriceGroupsSelected(false)
    setSelectedTab('AccessSellingPriceGroups')
  }
  const handleNotificationClick = () => {
    setIsNotificationSelected(!isNotificationSelected)
    setIsNotificationSelected(false)
    setSelectedTab('Notification')
  }
  const handleAssetManagementClick = () => {
    setIsAssetManagementSelected(!isAssetManagementSelected)
    setIsAssetManagementSelected(false)
    setSelectedTab('AssetManagement')
  }
  const handleCODClick = () => {
    setIsCODSelected(!isCODSelected)
    setIsCODSelected(false)
    setSelectedTab('COD')
  }
  const handleInternalIntegrationClick = () => {
    setIsInternalIntegrationSelected(!isInternalIntegrationSelected)
    setIsInternalIntegrationSelected(false)
    setSelectedTab('InternalIntegration')
  }
  const handleManufacturingClick = () => {
    setIsManufacturingSelected(!isManufacturingSelected)
    setIsManufacturingSelected(false)
    setSelectedTab('Manufacturing')
  }
  const handlePromoCardClick = () => {
    setIsPromoCardSelected(!isPromoCardSelected)
    setIsPromoCardSelected(false)
    setSelectedTab('PromoCard')
  }
  const handleRepairClick = () => {
    setIsRepairSelected(!isRepairSelected)
    setIsRepairSelected(false)
    setSelectedTab('Repair')
  }
  const handleShopifyClick = () => {
    setIsShopifySelected(!isShopifySelected)
    setIsShopifySelected(false)
    setSelectedTab('Shopify')
  }
  const handleSuperadminClick = () => {
    setIsSuperadminSelected(!isSuperadminSelected)
    setIsSuperadminSelected(false)
    setSelectedTab('Superadmin')
  }
  const handleWoocommerceClick = () => {
    setIsWoocommerceSelected(!isWoocommerceSelected)
    setIsWoocommerceSelected(false)
    setSelectedTab('Woocommerce')
  }
  const handleReportsClick = () => {
    setIsReportsSelected(!isReportsSelected)
    setIsReportsSelected(false)
    setSelectedTab('Reports')
  }

  // user
  const [selectAllUserChecked, setSelectAllUserChecked] = useState(false)
  const [viewUserChecked, setViewUserChecked] = useState(false)
  const [addUserChecked, setAddUserChecked] = useState(false)
  const [editUserChecked, setEditUserChecked] = useState(false)
  const [deleteUserChecked, setDeleteUserChecked] = useState(false)
  const handleSelectAllUserChange = () => {
    setSelectAllUserChecked(!selectAllUserChecked)
  }

  useEffect(() => {
    setViewUserChecked(selectAllUserChecked)
    setAddUserChecked(selectAllUserChecked)
    setEditUserChecked(selectAllUserChecked)
    setDeleteUserChecked(selectAllUserChecked)
  }, [selectAllUserChecked])
  // roles
  const [selectAllRolesChecked, setSelectAllRolesChecked] = useState(false)
  const [viewRolesChecked, setViewRolesChecked] = useState(false)
  const [addRolesChecked, setAddRolesChecked] = useState(false)
  const [editRolesChecked, setEditRolesChecked] = useState(false)
  const [deleteRolesChecked, setDeleteRolesChecked] = useState(false)
  const handleSelectAllRolesChange = () => {
    setSelectAllRolesChecked(!selectAllRolesChecked)
  }

  useEffect(() => {
    setViewRolesChecked(selectAllRolesChecked)
    setAddRolesChecked(selectAllRolesChecked)
    setEditRolesChecked(selectAllRolesChecked)
    setDeleteRolesChecked(selectAllRolesChecked)
  }, [selectAllRolesChecked])

  // Fixed Commissions
  const [selectAllFcChecked, setSelectAllFcChecked] = useState(false)
  const [viewFcChecked, setViewFcChecked] = useState(false)
  const [addFcChecked, setAddFcChecked] = useState(false)
  const [editFcChecked, setEditFcChecked] = useState(false)
  const [deleteFcChecked, setDeleteFcChecked] = useState(false)
  const [assignRemoveFcChecked, setAssignRemoveFcChecked] = useState(false)
  const handleSelectAllFcChange = () => {
    setSelectAllFcChecked(!selectAllFcChecked)
  }

  useEffect(() => {
    setViewFcChecked(selectAllFcChecked)
    setAddFcChecked(selectAllFcChecked)
    setEditFcChecked(selectAllFcChecked)
    setDeleteFcChecked(selectAllFcChecked)
    setAssignRemoveFcChecked(selectAllFcChecked)
  }, [selectAllFcChecked])

  // Supplier
  const [selectAllSupplierChecked, setSelectAllSupplierChecked] =
    useState(false)
  const [viewSupplierChecked, setViewSupplierChecked] = useState(false)
  const [viewOwnSupplierChecked, setViewOwnSupplierChecked] = useState(false)
  const [addSupplierChecked, setAddSupplierChecked] = useState(false)
  const [editSupplierChecked, setEditSupplierChecked] = useState(false)
  const [deleteSupplierChecked, setDeleteSupplierChecked] = useState(false)
  const handleSelectAllSupplierChange = () => {
    setSelectAllSupplierChecked(!selectAllSupplierChecked)
  }

  useEffect(() => {
    setViewSupplierChecked(selectAllSupplierChecked)
    setViewOwnSupplierChecked(selectAllSupplierChecked)
    setAddSupplierChecked(selectAllSupplierChecked)
    setEditSupplierChecked(selectAllSupplierChecked)
    setDeleteSupplierChecked(selectAllSupplierChecked)
  }, [selectAllSupplierChecked])

  // Customer
  const [selectAllCustomerChecked, setSelectAllCustomerChecked] =
    useState(false)
  const [viewCustomerChecked, setViewCustomerChecked] = useState(false)
  const [viewOwnCustomerChecked, setViewOwnCustomerChecked] = useState(false)
  const [addCustomerChecked, setAddCustomerChecked] = useState(false)
  const [editCustomerChecked, setEditCustomerChecked] = useState(false)
  const [deleteCustomerChecked, setDeleteCustomerChecked] = useState(false)
  const handleSelectAllCustomerChange = () => {
    setSelectAllCustomerChecked(!selectAllCustomerChecked)
  }

  useEffect(() => {
    setViewCustomerChecked(selectAllCustomerChecked)
    setViewOwnCustomerChecked(selectAllCustomerChecked)
    setAddCustomerChecked(selectAllCustomerChecked)
    setEditCustomerChecked(selectAllCustomerChecked)
    setDeleteCustomerChecked(selectAllCustomerChecked)
  }, [selectAllCustomerChecked])

  // Product
  const [selectAllProductChecked, setSelectAllProductChecked] = useState(false)
  const [viewProductChecked, setViewProductChecked] = useState(false)
  const [addProductChecked, setAddProductChecked] = useState(false)
  const [editProductChecked, setEditProductChecked] = useState(false)
  const [deleteProductChecked, setDeleteProductChecked] = useState(false)
  const [addOpeningProductChecked, setAddOpeningProductChecked] =
    useState(false)
  const [viewPurchasePriceChecked, setViewPurchasePriceChecked] =
    useState(false)
  const [viewLocationProductChecked, setViewLocationProductChecked] =
    useState(false)
  const handleSelectAllProductChange = () => {
    setSelectAllProductChecked(!selectAllProductChecked)
  }

  useEffect(() => {
    setViewProductChecked(selectAllProductChecked)
    setAddProductChecked(selectAllProductChecked)
    setEditProductChecked(selectAllProductChecked)
    setDeleteProductChecked(selectAllProductChecked)
    setAddOpeningProductChecked(selectAllProductChecked)
    setViewPurchasePriceChecked(selectAllProductChecked)
    setViewLocationProductChecked(selectAllProductChecked)
  }, [selectAllProductChecked])

  // Purchase
  const [selectAllPurchaseChecked, setSelectAllPurchaseChecked] =
    useState(false)
  const [viewPurchaseChecked, setViewPurchaseChecked] = useState(false)
  const [addPurchaseChecked, setAddPurchaseChecked] = useState(false)
  const [editPurchaseChecked, setEditPurchaseChecked] = useState(false)
  const [deletePurchaseChecked, setDeletePurchaseChecked] = useState(false)
  const [addEditDeletePaymentsChecked, setAddEditDeletePaymentsChecked] =
    useState(false)
  const [updateStatusChecked, setUpdateStatusChecked] = useState(false)
  const [viewOwnPurchaseChecked, setViewOwnPurchaseChecked] = useState(false)
  const [addEditPurchasePriceChecked, setAddEditPurchasePriceChecked] =
    useState(false)
  const [addEditSellPriceChecked, setAddEditSellPriceChecked] = useState(false)
  const [
    enableCurrentStockShowingOptionChecked,
    setEnableCurrentStockShowingOptionChecked,
  ] = useState(false)
  const handleSelectAllPurchaseChange = () => {
    setSelectAllPurchaseChecked(!selectAllPurchaseChecked)
  }

  useEffect(() => {
    setViewPurchaseChecked(selectAllPurchaseChecked)
    setAddPurchaseChecked(selectAllPurchaseChecked)
    setEditPurchaseChecked(selectAllPurchaseChecked)
    setDeletePurchaseChecked(selectAllPurchaseChecked)
    setAddEditDeletePaymentsChecked(selectAllPurchaseChecked)
    setUpdateStatusChecked(selectAllPurchaseChecked)
    setViewOwnPurchaseChecked(selectAllPurchaseChecked)
    setAddEditPurchasePriceChecked(selectAllPurchaseChecked)
    setAddEditSellPriceChecked(selectAllPurchaseChecked)
    setEnableCurrentStockShowingOptionChecked(selectAllPurchaseChecked)
  }, [selectAllPurchaseChecked])

  // stockAdjust
  const [selectAllStockChecked, setSelectAllStockChecked] = useState(false)
  const [viewStockChecked, setViewStockChecked] = useState(false)
  const [addStockChecked, setAddStockChecked] = useState(false)
  const [editStockChecked, setEditStockChecked] = useState(false)
  const [deleteStockChecked, setDeleteStockChecked] = useState(false)
  const handleSelectAllStockChange = () => {
    setSelectAllStockChecked(!selectAllStockChecked)
  }

  useEffect(() => {
    setViewStockChecked(selectAllStockChecked)
    setAddStockChecked(selectAllStockChecked)
    setEditStockChecked(selectAllStockChecked)
    setDeleteStockChecked(selectAllStockChecked)
  }, [selectAllStockChecked])

  // StockTransfer
  const [selectAllStockTransferChecked, setSelectAllStockTransferChecked] =
    useState(false)
  const [viewStockTransferChecked, setViewStockTransferChecked] =
    useState(false)
  const [addStockTransferChecked, setAddStockTransferChecked] = useState(false)
  const [deleteStockTransferChecked, setDeleteStockTransferChecked] =
    useState(false)
  const [updateStockTransferChecked, setUpdateStockTransferChecked] =
    useState(false)
  const [
    enableStockTransferPendingChecked,
    setEnableStockTransferPendingChecked,
  ] = useState(false)
  const [
    enableStockTransferTransitChecked,
    setEnableStockTransferTransitChecked,
  ] = useState(false)
  const [
    enableStockTransferReceiverChecked,
    setEnableStockTransferReceiverChecked,
  ] = useState(false)
  const [
    enableStockTransferSenderChecked,
    setEnableStockTransferSenderChecked,
  ] = useState(false)
  const [
    enableStockTransferCancelChecked,
    setEnableStockTransferCancelChecked,
  ] = useState(false)
  const handleSelectAllStockTransferChange = () => {
    setSelectAllStockTransferChecked(!selectAllStockTransferChecked)
  }

  useEffect(() => {
    setViewStockTransferChecked(selectAllStockTransferChecked)
    setAddStockTransferChecked(selectAllStockTransferChecked)
    setDeleteStockTransferChecked(selectAllStockTransferChecked)
    setUpdateStockTransferChecked(selectAllStockTransferChecked)
    setEnableStockTransferPendingChecked(selectAllStockTransferChecked)
    setEnableStockTransferTransitChecked(selectAllStockTransferChecked)
    setEnableStockTransferReceiverChecked(selectAllStockTransferChecked)
    setEnableStockTransferSenderChecked(selectAllStockTransferChecked)
    setEnableStockTransferCancelChecked(selectAllStockTransferChecked)
  }, [selectAllStockTransferChecked])

  // Sell
  const [selectAllSellChecked, setSelectAllSellChecked] = useState(false)
  const [viewSellChecked, setViewSellChecked] = useState(false)
  const [addSellChecked, setAddSellChecked] = useState(false)
  const [editSellChecked, setEditSellChecked] = useState(false)
  const [deleteSellChecked, setDeleteSellChecked] = useState(false)
  const [editSuspendSellChecked, setEditSuspendSellChecked] = useState(false)
  const [accessSellChecked, setAccessSellChecked] = useState(false)
  const [listDraftChecked, setListDraftChecked] = useState(false)
  const [listQuotationsChecked, setListQuotationsChecked] = useState(false)
  const [listOwnSaleChecked, setListOwnSaleChecked] = useState(false)
  const [addEditPaymentsChecked, setAddEditPaymentsChecked] = useState(false)
  const [editProductPriceSalesChecked, setEditProductPriceSalesChecked] =
    useState(false)
  const [editProductPricePosChecked, setEditProductPricePosChecked] =
    useState(false)
  const [editProductDiscountSalesChecked, setEditProductDiscountSalesChecked] =
    useState(false)
  const [editProductDiscountPosChecked, setEditProductDiscountPosChecked] =
    useState(false)
  const [addEditDiscountChecked, setAddEditDiscountChecked] = useState(false)
  const [accessShipmentChecked, setAccessShipmentChecked] = useState(false)
  const [accessTypesOfServiceChecked, setAccessTypesOfServiceChecked] =
    useState(false)
  const [accessSellReturnChecked, setAccessSellReturnChecked] = useState(false)
  const [accessNonReceiptExchangeChecked, setAccessNonReceiptExchangeChecked] =
    useState(false)
  const [viewAllDdateRangeChecked, setViewAllDdateRangeChecked] =
    useState(false)
  const [minimumSalePriceOverrideChecked, setMinimumSalePriceOverrideChecked] =
    useState(false)
  const [enableLocationChangeChecked, setEnableLocationChangeChecked] =
    useState(false)
  const [accessCreditSaleChecked, setAccessCreditSaleChecked] = useState(false)

  const handleSelectAllSellChange = () => {
    setSelectAllSellChecked(!selectAllSellChecked)
  }

  useEffect(() => {
    setViewSellChecked(selectAllSellChecked)
    setAddSellChecked(selectAllSellChecked)
    setEditSellChecked(selectAllSellChecked)
    setDeleteSellChecked(selectAllSellChecked)
    setEditSuspendSellChecked(selectAllSellChecked)
    setAccessSellChecked(selectAllSellChecked)
    setListDraftChecked(selectAllSellChecked)
    setListQuotationsChecked(selectAllSellChecked)
    setListOwnSaleChecked(selectAllSellChecked)
    setAddEditPaymentsChecked(selectAllSellChecked)
    setEditProductPriceSalesChecked(selectAllSellChecked)
    setEditProductPricePosChecked(selectAllSellChecked)
    setEditProductDiscountSalesChecked(selectAllSellChecked)
    setEditProductDiscountPosChecked(selectAllSellChecked)
    setAddEditDiscountChecked(selectAllSellChecked)
    setAccessShipmentChecked(selectAllSellChecked)
    setAccessTypesOfServiceChecked(selectAllSellChecked)
    setAccessSellReturnChecked(selectAllSellChecked)
    setAccessNonReceiptExchangeChecked(selectAllSellChecked)
    setViewAllDdateRangeChecked(selectAllSellChecked)
    setMinimumSalePriceOverrideChecked(selectAllSellChecked)
    setEnableLocationChangeChecked(selectAllSellChecked)
    setAccessCreditSaleChecked(selectAllSellChecked)
  }, [selectAllSellChecked])

  // cashRegister
  const [selectAllCashRegisterChecked, setSelectAllCashRegisterChecked] =
    useState(false)
  const [viewCashRegisterChecked, setViewCashRegisterChecked] = useState(false)
  const [closeCashRegisterChecked, setCloseCashRegisterChecked] =
    useState(false)
  const [
    closeCashRegisterWithoutViewChecked,
    setCloseCashRegisterWithoutViewChecked,
  ] = useState(false)
  const handleSelectAllCashRegisterChange = () => {
    setSelectAllCashRegisterChecked(!selectAllCashRegisterChecked)
  }

  useEffect(() => {
    setViewCashRegisterChecked(selectAllCashRegisterChecked)
    setCloseCashRegisterChecked(selectAllCashRegisterChecked)
    setCloseCashRegisterWithoutViewChecked(selectAllCashRegisterChecked)
  }, [selectAllCashRegisterChecked])

  // Brand
  const [selectAllBrandChecked, setSelectAllBrandChecked] = useState(false)
  const [viewBrandChecked, setViewBrandChecked] = useState(false)
  const [addBrandChecked, setAddBrandChecked] = useState(false)
  const [editBrandChecked, setEditBrandChecked] = useState(false)
  const [deleteBrandChecked, setDeleteBrandChecked] = useState(false)
  const handleSelectAllBrandChange = () => {
    setSelectAllBrandChecked(!selectAllBrandChecked)
  }

  useEffect(() => {
    setViewBrandChecked(selectAllBrandChecked)
    setAddBrandChecked(selectAllBrandChecked)
    setEditBrandChecked(selectAllBrandChecked)
    setDeleteBrandChecked(selectAllBrandChecked)
  }, [selectAllBrandChecked])

  // TaxRate
  const [selectAllTaxRateChecked, setSelectAllTaxRateChecked] = useState(false)
  const [viewTaxRateChecked, setViewTaxRateChecked] = useState(false)
  const [addTaxRateChecked, setAddTaxRateChecked] = useState(false)
  const [editTaxRateChecked, setEditTaxRateChecked] = useState(false)
  const [deleteTaxRateChecked, setDeleteTaxRateChecked] = useState(false)
  const handleSelectAllTaxRateChange = () => {
    setSelectAllTaxRateChecked(!selectAllTaxRateChecked)
  }

  useEffect(() => {
    setViewTaxRateChecked(selectAllTaxRateChecked)
    setAddTaxRateChecked(selectAllTaxRateChecked)
    setEditTaxRateChecked(selectAllTaxRateChecked)
    setDeleteTaxRateChecked(selectAllTaxRateChecked)
  }, [selectAllTaxRateChecked])

  // Unit
  const [selectAllUnitChecked, setSelectAllUnitChecked] = useState(false)
  const [viewUnitChecked, setViewUnitChecked] = useState(false)
  const [addUnitChecked, setAddUnitChecked] = useState(false)
  const [editUnitChecked, setEditUnitChecked] = useState(false)
  const [deleteUnitChecked, setDeleteUnitChecked] = useState(false)
  const handleSelectAllUnitChange = () => {
    setSelectAllUnitChecked(!selectAllUnitChecked)
  }

  useEffect(() => {
    setViewUnitChecked(selectAllUnitChecked)
    setAddUnitChecked(selectAllUnitChecked)
    setEditUnitChecked(selectAllUnitChecked)
    setDeleteUnitChecked(selectAllUnitChecked)
  }, [selectAllUnitChecked])

  // Category
  const [selectAllCategoryChecked, setSelectAllCategoryChecked] =
    useState(false)
  const [viewCategoryChecked, setViewCategoryChecked] = useState(false)
  const [addCategoryChecked, setAddCategoryChecked] = useState(false)
  const [editCategoryChecked, setEditCategoryChecked] = useState(false)
  const [deleteCategoryChecked, setDeleteCategoryChecked] = useState(false)
  const handleSelectAllCategoryChange = () => {
    setSelectAllCategoryChecked(!selectAllCategoryChecked)
  }

  useEffect(() => {
    setViewCategoryChecked(selectAllCategoryChecked)
    setAddCategoryChecked(selectAllCategoryChecked)
    setEditCategoryChecked(selectAllCategoryChecked)
    setDeleteCategoryChecked(selectAllCategoryChecked)
  }, [selectAllCategoryChecked])

  // Settings
  const [selectAllSettingsChecked, setSelectAllSettingsChecked] =
    useState(false)
  const [accessBusinessSettingsChecked, setAccessBusinessSettingsChecked] =
    useState(false)
  const [accessBarcodeSettingsChecked, setAccessBarcodeSettingsChecked] =
    useState(false)
  const [accessInvoiceSettingsChecked, setAccessInvoiceSettingsChecked] =
    useState(false)
  const [accessExpensesChecked, setAccessExpensesChecked] = useState(false)
  const [viewOwnExpensesChecked, setViewOwnExpensesChecked] = useState(false)
  const [accessPrintersChecked, setAccessPrintersChecked] = useState(false)
  const handleSelectAllSettingsChange = () => {
    setSelectAllSettingsChecked(!selectAllSettingsChecked)
  }

  useEffect(() => {
    setAccessBusinessSettingsChecked(selectAllSettingsChecked)
    setAccessBarcodeSettingsChecked(selectAllSettingsChecked)
    setAccessInvoiceSettingsChecked(selectAllSettingsChecked)
    setAccessExpensesChecked(selectAllSettingsChecked)
    setViewOwnExpensesChecked(selectAllSettingsChecked)
    setAccessPrintersChecked(selectAllSettingsChecked)
  }, [selectAllSettingsChecked])

  // Accounts
  const [selectAllAccountsChecked, setSelectAllAccountsChecked] =
    useState(false)
  const [listAccountsChecked, setListAccountsChecked] = useState(false)
  const [balanceSheetChecked, setBalanceSheetChecked] = useState(false)
  const [cashFlowChecked, setCashFlowChecked] = useState(false)
  const [paymentAccountReportChecked, setPaymentAccountReportChecked] =
    useState(false)
  const [viewAllDateRangeChecked, setViewAllDateRangeChecked] = useState(false)
  const handleSelectAllAccountsChange = () => {
    setSelectAllAccountsChecked(!selectAllAccountsChecked)
  }

  useEffect(() => {
    setListAccountsChecked(selectAllAccountsChecked)
    setBalanceSheetChecked(selectAllAccountsChecked)
    setCashFlowChecked(selectAllAccountsChecked)
    setPaymentAccountReportChecked(selectAllAccountsChecked)
    setViewAllDateRangeChecked(selectAllAccountsChecked)
  }, [selectAllAccountsChecked])

  // Reports1
  const [
    selectAllselectPreliminaryReportsChecked,
    setSelectAllselectPreliminaryReportsChecked,
  ] = useState(false)
  const [profitLossReportChecked, setProfitLossReportChecked] = useState(false)
  const [registerReportChecked, setRegisterReportChecked] = useState(false)
  const [expenseReportChecked, setExpenseReportChecked] = useState(false)
  const [taxReportChecked, setTaxReportChecked] = useState(false)
  const handleSelectAllselectPreliminaryReportsChange = () => {
    setSelectAllselectPreliminaryReportsChecked(
      !selectAllselectPreliminaryReportsChecked
    )
  }

  useEffect(() => {
    setProfitLossReportChecked(selectAllselectPreliminaryReportsChecked)
    setRegisterReportChecked(selectAllselectPreliminaryReportsChecked)
    setExpenseReportChecked(selectAllselectPreliminaryReportsChecked)
    setTaxReportChecked(selectAllselectPreliminaryReportsChecked)
  }, [selectAllselectPreliminaryReportsChecked])

  // Reports2
  const [selectAllsalesPurchaseChecked, setSelectAllsalesPurchaseChecked] =
    useState(false)
  const [productPurchaseReportChecked, setProductPurchaseReportChecked] =
    useState(false)
  const [productSellReportChecked, setProductSellReportChecked] =
    useState(false)
  const [dailySaleReportChecked, setDailySaleReportChecked] = useState(false)
  const [purchasePaymentReportChecked, setPurchasePaymentReportChecked] =
    useState(false)
  const [
    locationWiseProductSellReportChecked,
    setLocationWiseProductSellReportChecked,
  ] = useState(false)
  const [sellPaymentReportChecked, setSellPaymentReportChecked] =
    useState(false)
  const [chequeReportChecked, setChequeReportChecked] = useState(false)
  const [purchaseSaleReportChecked, setPurchaseSaleReportChecked] =
    useState(false)
  const [invoicePrintCountReportChecked, setInvoicePrintCountReportChecked] =
    useState(false)
  const handleSelectAllsalesPurchaseChange = () => {
    setSelectAllsalesPurchaseChecked(!selectAllsalesPurchaseChecked)
  }

  useEffect(() => {
    setProductPurchaseReportChecked(selectAllsalesPurchaseChecked)
    setProductSellReportChecked(selectAllsalesPurchaseChecked)
    setDailySaleReportChecked(selectAllsalesPurchaseChecked)
    setPurchasePaymentReportChecked(selectAllsalesPurchaseChecked)
    setLocationWiseProductSellReportChecked(selectAllsalesPurchaseChecked)
    setSellPaymentReportChecked(selectAllsalesPurchaseChecked)
    setChequeReportChecked(selectAllsalesPurchaseChecked)
    setPurchaseSaleReportChecked(selectAllsalesPurchaseChecked)
    setInvoicePrintCountReportChecked(selectAllsalesPurchaseChecked)
  }, [selectAllsalesPurchaseChecked])

  // Reports3
  const [
    selectAllStockRelatedReportsChecked,
    setSelectAllStockRelatedReportsChecked,
  ] = useState(false)
  const [itemsReportChecked, setItemsReportChecked] = useState(false)
  const [trendingProductsReportChecked, setTrendingProductsReportChecked] =
    useState(false)
  const [stockAdjustmentReportChecked, setStockAdjustmentReportChecked] =
    useState(false)
  const [stockMovementReportChecked, setStockMovementReportChecked] =
    useState(false)
  const [bartenderReportChecked, setBartenderReportChecked] = useState(false)
  const [stockReportChecked, setStockReportChecked] = useState(false)
  const [stockExpiryReportChecked, setStockExpiryReportChecked] =
    useState(false)
  const [lotReportChecked, setLotReportChecked] = useState(false)
  const [locationWiseStockReportChecked, setLocationWiseStockReportChecked] =
    useState(false)
  const [dateWiseStockReportChecked, setDateWiseStockReportChecked] =
    useState(false)
  const [supplierWiseAlertStockChecked, setSupplierWiseAlertStockChecked] =
    useState(false)
  const handleSelectAllStockRelatedReportsChange = () => {
    setSelectAllStockRelatedReportsChecked(!selectAllStockRelatedReportsChecked)
  }

  useEffect(() => {
    setItemsReportChecked(selectAllStockRelatedReportsChecked)
    setTrendingProductsReportChecked(selectAllStockRelatedReportsChecked)
    setStockAdjustmentReportChecked(selectAllStockRelatedReportsChecked)
    setStockMovementReportChecked(selectAllStockRelatedReportsChecked)
    setBartenderReportChecked(selectAllStockRelatedReportsChecked)
    setStockReportChecked(selectAllStockRelatedReportsChecked)
    setStockExpiryReportChecked(selectAllStockRelatedReportsChecked)
    setLotReportChecked(selectAllStockRelatedReportsChecked)
    setLocationWiseStockReportChecked(selectAllStockRelatedReportsChecked)
    setDateWiseStockReportChecked(selectAllStockRelatedReportsChecked)
    setSupplierWiseAlertStockChecked(selectAllStockRelatedReportsChecked)
  }, [selectAllStockRelatedReportsChecked])

  // Reports4
  const [
    selectAlluserContactsReportsChecked,
    setSelectAlluserContactsReportsChecked,
  ] = useState(false)
  const [supplierCustomerReportChecked, setSupplierCustomerReportChecked] =
    useState(false)
  const [customerGroupsReportChecked, setCustomerGroupsReportChecked] =
    useState(false)
  const [
    salesRepresentativeReportChecked,
    setSalesRepresentativeReportChecked,
  ] = useState(false)
  const [fixedSalesCommissionChecked, setFixedSalesCommissionChecked] =
    useState(false)
  const [agingReportChecked, setAgingReportChecked] = useState(false)
  const handleSelectAlluserContactsReportsChange = () => {
    setSelectAlluserContactsReportsChecked(!selectAlluserContactsReportsChecked)
  }

  useEffect(() => {
    setSupplierCustomerReportChecked(selectAlluserContactsReportsChecked)
    setCustomerGroupsReportChecked(selectAlluserContactsReportsChecked)
    setSalesRepresentativeReportChecked(selectAlluserContactsReportsChecked)
    setFixedSalesCommissionChecked(selectAlluserContactsReportsChecked)
    setAgingReportChecked(selectAlluserContactsReportsChecked)
  }, [selectAlluserContactsReportsChecked])

  // Reports5
  const [selectAllcODReportsChecked, setSelectAllcODReportsChecked] =
    useState(false)
  const [trasExpressCODReportChecked, setTrasExpressCODReportChecked] =
    useState(false)
  const [koombiyoCODReportChecked, setKoombiyoCODReportChecked] =
    useState(false)
  const handleSelectAllcODReportsChange = () => {
    setSelectAllcODReportsChecked(!selectAllcODReportsChecked)
  }

  useEffect(() => {
    setTrasExpressCODReportChecked(selectAllcODReportsChecked)
    setKoombiyoCODReportChecked(selectAllcODReportsChecked)
  }, [selectAllcODReportsChecked])

  // Reports6
  const [
    selectAllrestaurantReportsChecked,
    setSelectAllrestaurantReportsChecked,
  ] = useState(false)
  const [kitchenReportChecked, setKitchenReportChecked] = useState(false)
  const [serviceStaffReportChecked, setServiceStaffReportChecked] =
    useState(false)
  const [tableReportChecked, setTableReportChecked] = useState(false)
  const handleSelectAllrestaurantReportsChange = () => {
    setSelectAllrestaurantReportsChecked(!selectAllrestaurantReportsChecked)
  }

  useEffect(() => {
    setKitchenReportChecked(selectAllrestaurantReportsChecked)
    setServiceStaffReportChecked(selectAllrestaurantReportsChecked)
    setTableReportChecked(selectAllrestaurantReportsChecked)
  }, [selectAllrestaurantReportsChecked])


  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-10">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <InputElement
            label={`${t('addUserManagementRoles.fields.roleName.label')}`}
            register={register}
            name="prefix"
            placeholder={`${t(
              'addUserManagementRoles.fields.roleName.placeolder'
            )}`}
            id="prefix"
            error={errors.roleName}
            required
          />

          <div className=" intro-y flex flex-col items-center font-medium sm:flex-row">
            {`${t('addUserManagementRoles.fields.userType.label')}`} :
            <FormCheck className="">
              <FormCheck.Input
                id="vertical-form-3"
                type="checkbox"
                value=""
                onChange={handleChange}
                className="ml-2"
              />
              <div className="ml-2 mr-2 font-medium">{`${t(
                'addUserManagementRoles.fields.userType.checkLabel'
              )}`}</div>
              <FormCheck.Label className="mr-2" htmlFor="vertical-form-3">
                <div className="mx-1 -ml-1 flex">
                  <FormInfo
                    toolagrisync={`${t(
                      'addUserManagementRoles.fields.userType.toolagrisync'
                    )}`}
                  />
                </div>
              </FormCheck.Label>
            </FormCheck>
          </div>
        </div>
      </div>
      <div className="intro-y mt-5 grid grid-cols-12 gap-5">
        {/* BEGIN: Chat Side Menu */}
        <Tab.Group className="col-span-12 lg:col-span-4 2xl:col-span-3 ">

        <div className="px-5 py-3 box">
        <div className="mb-2 py-1 text-lg justify-center font-medium text-center">
                {`${t('addUserManagementRoles.fields.permissions.title')}`}
              </div>
              <div className="relative mb-1 text-slate-500">
              <FormInput
                type="text"
                className="box h-8 pr-10"
                placeholder="Search..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4"
              />
            </div>
                </div>

                {/* <div className="intro-y pr-1">
          <div className="box p-2 px-5">
            <Tab.List variant="pills">
              <div className="mb-2 py-1 text-lg justify-center font-medium text-center">
                {`${t('addUserManagementRoles.fields.permissions.title')}`}
              </div>
            </Tab.List>
            <div className="relative mb-1 text-slate-500">
              <FormInput
                type="text"
                className="box h-8 pr-10"
                placeholder="Search..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4"
              />
            </div>
          </div>
        </div> */}


          <Tab.Panels >
            <Tab.Panel>
              {/* <div className="pr-1"></div> */}
              <div className="  mt-2 h-[440px] overflow-y-auto pr-1">
                {/* User */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'User',
                  })}
                  onClick={() => {
                    showChatBox('User')
                    handleUserClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10   overflow-hidden rounded-full">
                      <Lucide icon="User" className="" />
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        User
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add User Permissions</div>
                  </div>
                </div>

                {/* Roles */}
                <div
                  className={clsx({
                    'intro-x box relative mt-5 flex cursor-pointer items-center p-5':
                      true,
                    'bg-primary text-white': selectedTab === 'Roles',
                  })}
                  onClick={() => {
                    showChatBox('Roles')
                    handleRolesClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button
                      // variant="secondary"
                      className="  flex h-10 w-10  overflow-hidden rounded-full"
                    >
                      <Lucide icon="Map" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Roles
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Roles</div>
                  </div>
                </div>

                {/* Fixed Commissions */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'FixedCom',
                  })}
                  onClick={() => {
                    showChatBox('FixedCom')
                    handleFixedComClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Lock" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Fixed Commission
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">
                      Add Fixed Commission Roles
                    </div>
                  </div>
                </div>

                {/* Supplier */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Supplier',
                  })}
                  onClick={() => {
                    showChatBox('Supplier')
                    handleSupplierClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Package" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Supplier
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Supplier Roles</div>
                  </div>
                </div>

                {/* Customer */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Customer',
                  })}
                  onClick={() => {
                    showChatBox('Customer')
                    handleCustomerClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Users" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Customer
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Customer Roles</div>
                  </div>
                </div>

                {/* Product */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Product',
                  })}
                  onClick={() => {
                    showChatBox('Product')
                    handleProductClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Copy" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Product
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Product Roles</div>
                  </div>
                </div>

                {/* Purchase */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Purchase',
                  })}
                  onClick={() => {
                    showChatBox('Purchase')
                    handlePurchaseClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="DollarSign" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Purchase
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Purchase Roles</div>
                  </div>
                </div>
                {/* Stock Adjustment */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'StockAdjust',
                  })}
                  onClick={() => {
                    showChatBox('Stock Adjust')
                    handleStockAdjustClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Triangle" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Stock Adjustment
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Stock Adjustment</div>
                  </div>
                </div>

                {/* Stock Transfer */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'StockTransfer',
                  })}
                  onClick={() => {
                    showChatBox('Stock Transfer')
                    handleStockTransferClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Truck" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Stock Transfer
                      </a>
                    </div>
                    <div className="ml-auto text-xs">Add Stock Transfer</div>
                  </div>
                </div>
                {/* Sell */}

                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Sell',
                  })}
                  onClick={() => {
                    showChatBox('Sell')
                    handleSellClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Codesandbox" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Sell
                      </a>
                    </div>
                    <div className="ml-auto text-xs">Add Sell</div>
                  </div>
                </div>

                {/* Cash Register */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'CashRegister',
                  })}
                  onClick={() => {
                    showChatBox('CashRegister')
                    handleCashRegisterClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="BookOpen" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Cash Register
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">
                      Add Cash Register Roles
                    </div>
                  </div>
                </div>

                {/* Brand */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Brand',
                  })}
                  onClick={() => {
                    showChatBox('Brand')
                    handleBrandClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Star" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Brand
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Brand Roles</div>
                  </div>
                </div>

                {/* TaxRate */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'TaxRate',
                  })}
                  onClick={() => {
                    showChatBox('TaxRate')
                    handleTaxRateClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Type" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Tax Rate
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Tax Rate Roles</div>
                  </div>
                </div>
                {/* Unit */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Unit',
                  })}
                  onClick={() => {
                    showChatBox('Unit')
                    handleUnitClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="TrendingDown" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Unit
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Unit Roles</div>
                  </div>
                </div>
                {/* Category */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Category',
                  })}
                  onClick={() => {
                    showChatBox('Category')
                    handleCategoryClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Copy" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Category
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Category Roles</div>
                  </div>
                </div>
                {/* Settings */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Settings',
                  })}
                  onClick={() => {
                    showChatBox('Settings')
                    handleSettingsClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Settings" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        Settings
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Settings Roles</div>
                  </div>
                </div>
                {/* Home */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Home',
                  })}
                  onClick={() => {
                    showChatBox('Home')
                    handleHomeClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Home" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.home.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Home Roles</div>
                  </div>
                </div>
                {/* Account */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Accounts',
                  })}
                  onClick={() => {
                    showChatBox('Account')
                    handleAccountsClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Folder" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.account.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Account Roles</div>
                  </div>
                </div>
                {/* Access Selling Price Groups */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white':
                      selectedTab === 'AccessSellingPriceGroups',
                  })}
                  onClick={() => {
                    showChatBox('AccessSellingPriceGroups')
                    handleAccessSellingPriceGroupsClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Server" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.accessSellingPriceGroups.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Roles</div>
                  </div>
                </div>
                {/* Notification */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Notification',
                  })}
                  onClick={() => {
                    showChatBox('Notification')
                    handleNotificationClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Bell" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.notification.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">
                      Add Notification Roles
                    </div>
                  </div>
                </div>
                {/* AssetManagement */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'AssetManagement',
                  })}
                  onClick={() => {
                    showChatBox('AssetManagement')
                    handleAssetManagementClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="CheckSquare" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.assetManagement.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">
                      Add Asset Management Roles
                    </div>
                  </div>
                </div>
                {/* COD */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'COD',
                  })}
                  onClick={() => {
                    showChatBox('COD')
                    handleCODClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Dribbble" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.cod.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add COD Roles</div>
                  </div>
                </div>
                {/* InternalIntegration */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white':
                      selectedTab === 'InternalIntegration',
                  })}
                  onClick={() => {
                    showChatBox('InternalIntegration')
                    handleInternalIntegrationClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Maximize" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.internalIntegration.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">
                      Add Internal Integration Roles
                    </div>
                  </div>
                </div>
                {/* Manufacturing */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Manufacturing',
                  })}
                  onClick={() => {
                    showChatBox('Manufacturing')
                    handleManufacturingClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Edit3" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.manufacturing.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">
                      Add Manufacturing Roles
                    </div>
                  </div>
                </div>
                {/* Promo Card */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'PromoCard',
                  })}
                  onClick={() => {
                    showChatBox('PromoCard')
                    handlePromoCardClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="CreditCard" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.promoCard.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Promo Card Roles</div>
                  </div>
                </div>
                {/* Repair */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Repair',
                  })}
                  onClick={() => {
                    showChatBox('Repair')
                    handleRepairClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Shuffle" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.repair.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Repair Roles</div>
                  </div>
                </div>
                {/* Shopify */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Shopify',
                  })}
                  onClick={() => {
                    showChatBox('Shopify')
                    handleShopifyClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="ShoppingCart" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.shopify.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Shopify Roles</div>
                  </div>
                </div>
                {/* Superadmin */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Superadmin',
                  })}
                  onClick={() => {
                    showChatBox('Superadmin')
                    handleSuperadminClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Sun" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.superadmin.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Superadmin Roles</div>
                  </div>
                </div>
                {/* Woocommerce */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Woocommerce',
                  })}
                  onClick={() => {
                    showChatBox('Woocommerce')
                    handleWoocommerceClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="Wifi" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.woocommerce.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Superadmin Roles</div>
                  </div>
                </div>
                {/* Reports */}
                <div
                  className={clsx({
                    'intro-x box relative mt-4 flex cursor-pointer items-center p-5 pr-1':
                      true,
                    'bg-primary text-white': selectedTab === 'Reports',
                  })}
                  onClick={() => {
                    showChatBox('Reports')
                    handleReportsClick()
                  }}
                >
                  <div className="image-fit mr-1 flex-none">
                    <Button className="  flex h-10 w-10  overflow-hidden rounded-full">
                      <Lucide icon="FileText" className="" />{' '}
                    </Button>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="#" className="font-medium">
                        <div>{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.title'
                        )}`}</div>
                      </a>
                    </div>
                    <div className="ml-auto text-xs ">Add Report Roles</div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {/* END: Chat Side Menu */}
        {/* BEGIN: Chat Content */}
        <div className="intro-y col-span-12 lg:col-span-8 2xl:col-span-9">
          <div className="box h-auto">
            {/* BEGIN: Chat Active */}
            {selectedOption === 'User' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base"></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Select User
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3 ml-3 py-8 ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAll"
                        name="selectAll"
                        type="checkbox"
                        checked={selectAllUserChecked}
                        onChange={handleSelectAllUserChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.user.fields.selectAll.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewUser"
                        name="viewUser"
                        type="checkbox"
                        checked={viewUserChecked}
                        onChange={() => setViewUserChecked(!viewUserChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.user.fields.viewUser.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addUser"
                        name="addUser"
                        type="checkbox"
                        checked={addUserChecked}
                        onChange={() => setAddUserChecked(!addUserChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.user.fields.addUser.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editUser"
                        name="editUser"
                        type="checkbox"
                        checked={editUserChecked}
                        onChange={() => setEditUserChecked(!editUserChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.user.fields.editUser.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteUser"
                        name="deleteUser"
                        type="checkbox"
                        checked={deleteUserChecked}
                        onChange={() =>
                          setDeleteUserChecked(!deleteUserChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.user.fields.deleteUser.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Roles */}
            {selectedOption === 'Roles' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Select Roles
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllRole"
                        name="selectAllRole"
                        type="checkbox"
                        checked={selectAllRolesChecked}
                        onChange={handleSelectAllRolesChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.roles.fields.selectAllRole.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewRole"
                        name="viewRole"
                        type="checkbox"
                        checked={viewRolesChecked}
                        onChange={() => setViewRolesChecked(!viewRolesChecked)}
                      />
                      <div className="ml-2 mr-2">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.roles.fields.viewRole.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addRole"
                        name="addRole"
                        type="checkbox"
                        checked={addRolesChecked}
                        onChange={() => setAddRolesChecked(!addRolesChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.roles.fields.addRole.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editRoles"
                        name="editRoles"
                        type="checkbox"
                        checked={editRolesChecked}
                        onChange={() => setEditRolesChecked(!editRolesChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.roles.fields.editRole.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteRoles"
                        name="deleteRoles"
                        type="checkbox"
                        checked={deleteRolesChecked}
                        onChange={() =>
                          setDeleteRolesChecked(!deleteRolesChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.roles.fields.deleteRole.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* FixCom */}
            {selectedOption === 'FixedCom' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Fixed Commission
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className=" ml-6 grid grid-cols-1 gap-5 py-2 md:grid-cols-1 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllFc"
                        name="selectAllFc"
                        type="checkbox"
                        checked={selectAllFcChecked}
                        onChange={handleSelectAllFcChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.fc.fields.selectAllFc.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewFc"
                        name="viewFc"
                        type="checkbox"
                        checked={viewFcChecked}
                        onChange={() => setViewFcChecked(!viewFcChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.fc.fields.viewFc.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addRole"
                        name="addRole"
                        type="checkbox"
                        checked={addFcChecked}
                        onChange={() => setAddFcChecked(!addFcChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.fc.fields.addFc.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editFc"
                        name="editFc"
                        type="checkbox"
                        checked={editFcChecked}
                        onChange={() => setEditFcChecked(!editFcChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.fc.fields.editFc.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteFc"
                        name="deleteFc"
                        type="checkbox"
                        checked={deleteFcChecked}
                        onChange={() => setDeleteFcChecked(!deleteFcChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.fc.fields.deleteFc.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editassignRemove"
                        name="editassignRemove"
                        type="checkbox"
                        checked={assignRemoveFcChecked}
                        onChange={() =>
                          setAssignRemoveFcChecked(!assignRemoveFcChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.fc.fields.assignRemoveFc.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Supplier */}
            {selectedOption === 'Supplier' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Supplier
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className=" ml-6 grid grid-cols-1 gap-5 py-2 md:grid-cols-1 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllSupplier"
                        name="selectAllSupplier"
                        type="checkbox"
                        checked={selectAllSupplierChecked}
                        onChange={handleSelectAllSupplierChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.supplier.fields.selectAllSuppliers.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewSupplier"
                        name="viewSupplier"
                        type="checkbox"
                        checked={viewSupplierChecked}
                        onChange={() =>
                          setViewSupplierChecked(!viewSupplierChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.supplier.fields.viewAllSupplier.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewOwnSupplier"
                        name="viewOwnSupplier"
                        type="checkbox"
                        checked={viewOwnSupplierChecked}
                        onChange={() =>
                          setViewOwnSupplierChecked(!viewOwnSupplierChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.supplier.fields.viewOwnSupplier.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addSupplier"
                        name="addSupplier"
                        type="checkbox"
                        checked={addSupplierChecked}
                        onChange={() =>
                          setAddSupplierChecked(!addSupplierChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.supplier.fields.addSupplier.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editSupplier"
                        name="editSupplier"
                        type="checkbox"
                        checked={editSupplierChecked}
                        onChange={() =>
                          setEditSupplierChecked(!editSupplierChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.supplier.fields.editSupplier.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteSupplier"
                        name="deleteSupplier"
                        type="checkbox"
                        checked={deleteSupplierChecked}
                        onChange={() =>
                          setDeleteSupplierChecked(!deleteSupplierChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.supplier.fields.deleteSupplier.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Customer */}
            {selectedOption === 'Customer' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Customer
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className=" ml-6 grid grid-cols-1 gap-5 py-2 md:grid-cols-1 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllSupplier"
                        name="selectAllSupplier"
                        type="checkbox"
                        checked={selectAllCustomerChecked}
                        onChange={handleSelectAllCustomerChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.customer.fields.selectAllCustomers.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewCustomer"
                        name="viewCustomer"
                        type="checkbox"
                        checked={viewCustomerChecked}
                        onChange={() =>
                          setViewCustomerChecked(!viewCustomerChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.customer.fields.viewAllCustomer.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewOwnCustomer"
                        name="viewOwnCustomer"
                        type="checkbox"
                        checked={viewOwnCustomerChecked}
                        onChange={() =>
                          setViewOwnCustomerChecked(!viewOwnCustomerChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.customer.fields.viewOwnCustomer.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addCustomer"
                        name="addCustomer"
                        type="checkbox"
                        checked={addCustomerChecked}
                        onChange={() =>
                          setAddCustomerChecked(!addCustomerChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.customer.fields.addCustomer.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editCustomer"
                        name="editCustomer"
                        type="checkbox"
                        checked={editCustomerChecked}
                        onChange={() =>
                          setEditCustomerChecked(!editCustomerChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.customer.fields.editCustomer.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteCustomer"
                        name="deleteCustomer"
                        type="checkbox"
                        checked={deleteCustomerChecked}
                        onChange={() =>
                          setDeleteCustomerChecked(!deleteCustomerChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.customer.fields.deleteCustomer.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Product */}
            {selectedOption === 'Product' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Product
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className=" ml-6 grid grid-cols-1 gap-5 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllProduct"
                        name="selectAllProduct"
                        type="checkbox"
                        checked={selectAllProductChecked}
                        onChange={handleSelectAllProductChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.product.fields.selectAllProducts.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-5 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewProduct"
                        name="viewProduct"
                        type="checkbox"
                        checked={viewProductChecked}
                        onChange={() =>
                          setViewProductChecked(!viewProductChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.product.fields.viewAllProduct.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addProduct"
                        name="addProduct"
                        type="checkbox"
                        checked={addProductChecked}
                        onChange={() =>
                          setAddProductChecked(!addProductChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.product.fields.addProduct.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editProduct"
                        name="editProduct"
                        type="checkbox"
                        checked={editProductChecked}
                        onChange={() =>
                          setEditProductChecked(!editProductChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.product.fields.editProduct.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteProduct"
                        name="deleteProduct"
                        type="checkbox"
                        checked={deleteProductChecked}
                        onChange={() =>
                          setDeleteProductChecked(!deleteProductChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.product.fields.deleteProduct.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteAddOpeningStock"
                        name="deletAaddOpeningStock"
                        type="checkbox"
                        checked={addOpeningProductChecked}
                        onChange={() =>
                          setAddOpeningProductChecked(!addOpeningProductChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.product.fields.addOpeningStock.label'
                      )}`}</div>
                    </FormCheck>

                    <FormCheck className="">
                      <FormCheck.Input
                        id="viewPurchasePrice"
                        name="viewPurchasePrice"
                        type="checkbox"
                        checked={viewPurchasePriceChecked}
                        onChange={() =>
                          setViewPurchasePriceChecked(!viewPurchasePriceChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.product.fields.viewPurchasePrice.label'
                      )}`}</div>
                      <FormCheck.Label
                        className="mr-2"
                        htmlFor="vertical-form-3"
                      >
                        <div className="mx-1 -ml-1 flex">
                          <FormInfo
                            toolagrisync={`${t(
                              'addUserManagementRoles.fields.permissions.fields.product.fields.viewPurchasePrice.toolagrisync'
                            )}`}
                          />
                        </div>
                      </FormCheck.Label>
                    </FormCheck>

                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewAllLocationStock"
                        name="viewAllLocationStock"
                        type="checkbox"
                        checked={viewLocationProductChecked}
                        onChange={() =>
                          setViewLocationProductChecked(
                            !viewLocationProductChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.product.fields.viewAllLocationStock.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Purchase */}
            {selectedOption === 'Purchase' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Purchase
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className=" ml-6 grid grid-cols-1 gap-5 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllPurchase"
                        name="selectAllPurchase"
                        type="checkbox"
                        checked={selectAllPurchaseChecked}
                        onChange={handleSelectAllPurchaseChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.selectAllPurchase.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-5 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewPurchase"
                        name="viewPurchase"
                        type="checkbox"
                        checked={viewPurchaseChecked}
                        onChange={() =>
                          setViewPurchaseChecked(!viewPurchaseChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.viewAllPurchase.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addPurchase"
                        name="addPurchase"
                        type="checkbox"
                        checked={addPurchaseChecked}
                        onChange={() =>
                          setAddPurchaseChecked(!addPurchaseChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.addPurchase.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editPurchase"
                        name="editPurchase"
                        type="checkbox"
                        checked={editPurchaseChecked}
                        onChange={() =>
                          setEditPurchaseChecked(!editPurchaseChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.editPurchase.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deletePurchase"
                        name="deletePurchase"
                        type="checkbox"
                        checked={deletePurchaseChecked}
                        onChange={() =>
                          setDeletePurchaseChecked(!deletePurchaseChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.deletePurchase.label'
                      )}`}</div>
                    </FormCheck>

                    <FormCheck className="">
                      <FormCheck.Input
                        id="addEditDeletePayments"
                        name="addEditDeletePayments"
                        type="checkbox"
                        checked={addEditDeletePaymentsChecked}
                        onChange={() =>
                          setAddEditDeletePaymentsChecked(
                            !addEditDeletePaymentsChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.addEditDeletePayments.label'
                      )}`}</div>
                      <FormCheck.Label
                        className="mr-2"
                        htmlFor="vertical-form-3"
                      >
                        <div className="mx-1 -ml-1 flex">
                          <FormInfo
                            toolagrisync={`${t(
                              'addUserManagementRoles.fields.permissions.fields.purchase.fields.addEditDeletePayments.toolagrisync'
                            )}`}
                          />
                        </div>
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteAddOpeningStock"
                        name="deletAaddOpeningStock"
                        type="checkbox"
                        checked={updateStatusChecked}
                        onChange={() =>
                          setUpdateStatusChecked(!updateStatusChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.updateStatus.label'
                      )}`}</div>
                    </FormCheck>

                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewOwnPurchase"
                        name="viewOwnPurchase"
                        type="checkbox"
                        checked={viewOwnPurchaseChecked}
                        onChange={() =>
                          setViewOwnPurchaseChecked(!viewOwnPurchaseChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.viewOwnPurchase.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addEditPurchasePrice"
                        name="addEditPurchasePrice"
                        type="checkbox"
                        checked={addEditPurchasePriceChecked}
                        onChange={() =>
                          setAddEditPurchasePriceChecked(
                            !addEditPurchasePriceChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.addEditPurchasePrice.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addEditSellPrice"
                        name="addEditSellPrice"
                        type="checkbox"
                        checked={addEditSellPriceChecked}
                        onChange={() =>
                          setAddEditSellPriceChecked(!addEditSellPriceChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.addEditSellPrice.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="enableCurrentStockShowingOption"
                        name="enableCurrentStockShowingOption"
                        type="checkbox"
                        checked={enableCurrentStockShowingOptionChecked}
                        onChange={() =>
                          setEnableCurrentStockShowingOptionChecked(
                            !enableCurrentStockShowingOptionChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.purchase.fields.enableCurrentStockShowingOption.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Stock Adjust */}
            {selectedOption === 'Stock Adjust' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base"></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Stock Adjustment
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3 ml-3 py-8 ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAll"
                        name="selectAll"
                        type="checkbox"
                        checked={selectAllStockChecked}
                        onChange={handleSelectAllStockChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.user.fields.selectAll.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewStock"
                        name="viewStock"
                        type="checkbox"
                        checked={viewStockChecked}
                        onChange={() => setViewStockChecked(!viewStockChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockAdjustment.fields.viewstockAdjustment.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addStock"
                        name="addStock"
                        type="checkbox"
                        checked={addStockChecked}
                        onChange={() => setAddStockChecked(!addStockChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockAdjustment.fields.addstockAdjustment.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteStock"
                        name="deleteStock"
                        type="checkbox"
                        checked={deleteStockChecked}
                        onChange={() =>
                          setDeleteStockChecked(!deleteStockChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockAdjustment.fields.deletestockAdjustment.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editCurrentStock"
                        name="editCurrentStock"
                        type="checkbox"
                        checked={editStockChecked}
                        onChange={() => setEditStockChecked(!editStockChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockAdjustment.fields.editCurrentStock.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Stock Transfer */}
            {selectedOption === 'Stock Transfer' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base"></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Stock Transfer
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3 ml-3 py-8 ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAll"
                        name="selectAll"
                        type="checkbox"
                        checked={selectAllStockTransferChecked}
                        onChange={handleSelectAllStockTransferChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.user.fields.selectAll.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewStockTransfer"
                        name="viewStockTransfer"
                        type="checkbox"
                        checked={viewStockTransferChecked}
                        onChange={() =>
                          setViewStockChecked(!viewStockTransferChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.viewStockTransfer.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addStockTransfer"
                        name="addStockTransfer"
                        type="checkbox"
                        checked={addStockTransferChecked}
                        onChange={() =>
                          setAddStockChecked(!addStockTransferChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.addStockTransfer.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteStockTransfer"
                        name="deleteStockTransfer"
                        type="checkbox"
                        checked={deleteStockTransferChecked}
                        onChange={() =>
                          setDeleteStockChecked(!deleteStockTransferChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.deleteStockTransfer.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="updateStockTransfer"
                        name="updateStockTransfer"
                        type="checkbox"
                        checked={updateStockTransferChecked}
                        onChange={() =>
                          setUpdateStockTransferChecked(
                            !updateStockTransferChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.updateStockTransfer.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="enableStockTransferPending"
                        name="enableStockTransferPending"
                        type="checkbox"
                        checked={enableStockTransferPendingChecked}
                        onChange={() =>
                          setEditStockChecked(
                            !enableStockTransferPendingChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.enableStockTransferPending.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="enableStockTransferTransit"
                        name="enableStockTransferTransit"
                        type="checkbox"
                        checked={enableStockTransferTransitChecked}
                        onChange={() =>
                          setEnableStockTransferTransitChecked(
                            !enableStockTransferTransitChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.enableStockTransferTransit.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="enableStockTransferReceiver"
                        name="enableStockTransferReceiver"
                        type="checkbox"
                        checked={enableStockTransferReceiverChecked}
                        onChange={() =>
                          setEnableStockTransferReceiverChecked(
                            !enableStockTransferReceiverChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-3 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.enableStockTransferReceiver.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="enableStockTransferSender"
                        name="enableStockTransferSender"
                        type="checkbox"
                        checked={enableStockTransferSenderChecked}
                        onChange={() =>
                          setEnableStockTransferSenderChecked(
                            !enableStockTransferSenderChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-3 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.enableStockTransferSender.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="enableStockTransferStatusCancel"
                        name="enableStockTransferStatusCancel"
                        type="checkbox"
                        checked={enableStockTransferCancelChecked}
                        onChange={() =>
                          setEnableStockTransferCancelChecked(
                            !enableStockTransferCancelChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.stockTransfer.fields.enableStockTransferStatusCancel.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Sell */}
            {selectedOption === 'Sell' && (
              <div className="flex h-full flex-col ">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.title'
                      )}`}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className=" ml-6 grid grid-cols-1 gap-5 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllSell"
                        name="selectAllSell"
                        type="checkbox"
                        checked={selectAllSellChecked}
                        onChange={handleSelectAllSellChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.selectAll.label'
                      )}`}</div>
                    </FormCheck>

                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewSell"
                        name="viewSell"
                        type="checkbox"
                        checked={viewSellChecked}
                        onChange={() => setViewSellChecked(!viewSellChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.viewSell.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addSell"
                        name="addSell"
                        type="checkbox"
                        checked={addSellChecked}
                        onChange={() => setAddSellChecked(!addSellChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.addSell.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editSell"
                        name="editSell"
                        type="checkbox"
                        checked={editSellChecked}
                        onChange={() => setEditSellChecked(!editSellChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.editSell.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteSell"
                        name="deleteSell"
                        type="checkbox"
                        checked={deleteSellChecked}
                        onChange={() =>
                          setDeleteSellChecked(!deleteSellChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.deleteSell.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editSuspendSell"
                        name="editSuspendSell"
                        type="checkbox"
                        checked={editSuspendSellChecked}
                        onChange={() =>
                          setEditSuspendSellChecked(!editSuspendSellChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.editSuspendSell.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessSell"
                        name="accessSell"
                        type="checkbox"
                        checked={accessSellChecked}
                        onChange={() =>
                          setAccessSellChecked(!accessSellChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.accessSell.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="listDraft"
                        name="listDraft"
                        type="checkbox"
                        checked={listDraftChecked}
                        onChange={() => setListDraftChecked(!listDraftChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.listDraft.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="listQuotations"
                        name="listQuotations"
                        type="checkbox"
                        checked={listQuotationsChecked}
                        onChange={() =>
                          setListQuotationsChecked(!listQuotationsChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.listQuotations.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="listOwnSale"
                        name="listOwnSale"
                        type="checkbox"
                        checked={listOwnSaleChecked}
                        onChange={() =>
                          setListOwnSaleChecked(!listOwnSaleChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.listOwnSale.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="">
                      <FormCheck.Input
                        id="addEditPayments"
                        name="addEditPayments"
                        type="checkbox"
                        checked={addEditPaymentsChecked}
                        onChange={() =>
                          setAddEditPaymentsChecked(!addEditPaymentsChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.addEditPayments.label'
                      )}`}</div>
                      <FormCheck.Label
                        className="mr-2"
                        htmlFor="vertical-form-3"
                      >
                        <div className="mx-1 -ml-2 flex">
                          <FormInfo
                            toolagrisync={`${t(
                              'addUserManagementRoles.fields.permissions.fields.sell.fields.addEditPayments.toolagrisync'
                            )}`}
                          />
                        </div>
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editProductPriceSales"
                        name="editProductPriceSales"
                        type="checkbox"
                        checked={editProductPriceSalesChecked}
                        onChange={() =>
                          setEditProductPriceSalesChecked(
                            !editProductPriceSalesChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.editProductPriceSales.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editProductPricePos"
                        name="editProductPricePos"
                        type="checkbox"
                        checked={editProductPricePosChecked}
                        onChange={() =>
                          setEditProductPricePosChecked(
                            !editProductPricePosChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.editProductPricePos.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editProductDiscountSales"
                        name="editProductDiscountSales"
                        type="checkbox"
                        checked={editProductDiscountSalesChecked}
                        onChange={() =>
                          setEditProductDiscountSalesChecked(
                            !editProductDiscountSalesChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.editProductDiscountSales.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editProductDiscountPos"
                        name="editProductDiscountPos"
                        type="checkbox"
                        checked={editProductDiscountPosChecked}
                        onChange={() =>
                          setEditProductDiscountPosChecked(
                            !editProductDiscountPosChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.editProductDiscountPos.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addEditDiscount"
                        name="addEditDiscount"
                        type="checkbox"
                        checked={addEditDiscountChecked}
                        onChange={() =>
                          setAddEditDiscountChecked(!addEditDiscountChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.addEditDiscount.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessShipment"
                        name="accessShipment"
                        type="checkbox"
                        checked={accessShipmentChecked}
                        onChange={() =>
                          setAccessShipmentChecked(!accessShipmentChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.accessShipment.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessTypesOfService"
                        name="accessTypesOfService"
                        type="checkbox"
                        checked={accessTypesOfServiceChecked}
                        onChange={() =>
                          setAccessTypesOfServiceChecked(
                            !accessTypesOfServiceChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.accessTypesOfService.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessSellReturn"
                        name="accessSellReturn"
                        type="checkbox"
                        checked={accessSellReturnChecked}
                        onChange={() =>
                          setAccessSellReturnChecked(!accessSellReturnChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.accessSellReturn.label'
                      )}`}</div>
                    </FormCheck>

                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessNonReceiptExchange"
                        name="accessNonReceiptExchange"
                        type="checkbox"
                        checked={accessNonReceiptExchangeChecked}
                        onChange={() =>
                          setAccessNonReceiptExchangeChecked(
                            !accessNonReceiptExchangeChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.accessNonReceiptExchange.label'
                      )}`}</div>
                    </FormCheck>

                    <FormCheck className="">
                      <FormCheck.Input
                        id="viewAllDdateRange"
                        name="viewAllDdateRange"
                        type="checkbox"
                        checked={viewAllDdateRangeChecked}
                        onChange={() =>
                          setViewAllDdateRangeChecked(!viewAllDdateRangeChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.viewAllDdateRange.label'
                      )}`}</div>
                      <FormCheck.Label
                        className="mr-2"
                        htmlFor="vertical-form-3"
                      >
                        <div className="mx-1 -ml-2 flex">
                          <FormInfo
                            toolagrisync={`${t(
                              'addUserManagementRoles.fields.permissions.fields.sell.fields.viewAllDdateRange.toolagrisync'
                            )}`}
                          />
                        </div>
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="minimumSalePriceOverride"
                        name="minimumSalePriceOverride"
                        type="checkbox"
                        checked={minimumSalePriceOverrideChecked}
                        onChange={() =>
                          setMinimumSalePriceOverrideChecked(
                            !minimumSalePriceOverrideChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.minimumSalePriceOverride.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="">
                      <FormCheck.Input
                        id="enableLocationChange"
                        name="enableLocationChange"
                        type="checkbox"
                        checked={enableLocationChangeChecked}
                        onChange={() =>
                          setEnableLocationChangeChecked(
                            !enableLocationChangeChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.enableLocationChange.label'
                      )}`}</div>
                      <FormCheck.Label
                        className="mr-2"
                        htmlFor="vertical-form-3"
                      >
                        <div className="mx-1 -ml-2 flex">
                          <FormInfo
                            toolagrisync={`${t(
                              'addUserManagementRoles.fields.permissions.fields.sell.fields.enableLocationChange.toolagrisync'
                            )}`}
                          />
                        </div>
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessCreditSale"
                        name="accessCreditSale"
                        type="checkbox"
                        checked={accessCreditSaleChecked}
                        onChange={() =>
                          setAccessCreditSaleChecked(!accessCreditSaleChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.sell.fields.accessCreditSale.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}

            {/* CashRegister */}
            {selectedOption === 'CashRegister' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Cash Register
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className=" ml-6 grid grid-cols-1 gap-5 py-2 md:grid-cols-1 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllCash"
                        name="selectAllCash"
                        type="checkbox"
                        checked={selectAllCashRegisterChecked}
                        onChange={handleSelectAllCashRegisterChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.cashRegister.fields.selectAllCash.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewCashRegister"
                        name="viewCashRegister"
                        type="checkbox"
                        checked={viewCashRegisterChecked}
                        onChange={() =>
                          setViewCashRegisterChecked(!viewCashRegisterChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.cashRegister.fields.viewCashRegister.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="closeCashRegister"
                        name="closeCashRegister"
                        type="checkbox"
                        checked={closeCashRegisterChecked}
                        onChange={() =>
                          setCloseCashRegisterChecked(!closeCashRegisterChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.cashRegister.fields.closeCashRegister.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="closeCashRegisterWithoutView"
                        name="closeCashRegisterWithoutView"
                        type="checkbox"
                        checked={closeCashRegisterWithoutViewChecked}
                        onChange={() =>
                          setCloseCashRegisterWithoutViewChecked(
                            !closeCashRegisterWithoutViewChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.cashRegister.fields.closeCashRegisterWithoutView.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}

            {/* Brand */}
            {selectedOption === 'Brand' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Brand
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllBrand"
                        name="selectAllBrand"
                        type="checkbox"
                        checked={selectAllBrandChecked}
                        onChange={handleSelectAllBrandChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.brand.fields.selectAllBrand.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewBrand"
                        name="viewBrand"
                        type="checkbox"
                        checked={viewBrandChecked}
                        onChange={() => setViewBrandChecked(!viewBrandChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.brand.fields.viewBrand.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addBrand"
                        name="addBrand"
                        type="checkbox"
                        checked={addBrandChecked}
                        onChange={() => setAddBrandChecked(!addBrandChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.brand.fields.viewBrand.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editBrand"
                        name="editBrand"
                        type="checkbox"
                        checked={editBrandChecked}
                        onChange={() => setEditBrandChecked(!editBrandChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.brand.fields.editBrand.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deletetBrand"
                        name="deletetBrand"
                        type="checkbox"
                        checked={deleteBrandChecked}
                        onChange={() =>
                          setDeleteBrandChecked(!deleteBrandChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.brand.fields.deleteBrand.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Rate */}
            {selectedOption === 'TaxRate' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Tax Rate
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllTaxRate"
                        name="selectAllTaxRate"
                        type="checkbox"
                        checked={selectAllTaxRateChecked}
                        onChange={handleSelectAllTaxRateChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.taxRate.fields.selectAllTaxRate.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewTaxRate"
                        name="viewTaxRate"
                        type="checkbox"
                        checked={viewTaxRateChecked}
                        onChange={() =>
                          setViewTaxRateChecked(!viewTaxRateChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.taxRate.fields.viewTaxRate.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addTaxRate"
                        name="addTaxRate"
                        type="checkbox"
                        checked={addTaxRateChecked}
                        onChange={() =>
                          setAddTaxRateChecked(!addTaxRateChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.taxRate.fields.addTaxRate.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editTaxRate"
                        name="editTaxRate"
                        type="checkbox"
                        checked={editTaxRateChecked}
                        onChange={() =>
                          setEditTaxRateChecked(!editTaxRateChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.taxRate.fields.editTaxRate.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deletetTaxRate"
                        name="deletetTaxRate"
                        type="checkbox"
                        checked={deleteTaxRateChecked}
                        onChange={() =>
                          setDeleteTaxRateChecked(!deleteTaxRateChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.taxRate.fields.deleteTaxRate.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Unit */}
            {selectedOption === 'Unit' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">Unit</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllUnit"
                        name="selectAllUnit"
                        type="checkbox"
                        checked={selectAllUnitChecked}
                        onChange={handleSelectAllUnitChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.unit.fields.selectAllUnit.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewUnit"
                        name="viewUnit"
                        type="checkbox"
                        checked={viewUnitChecked}
                        onChange={() => setViewUnitChecked(!viewUnitChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.unit.fields.viewUnit.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addUnit"
                        name="addUnit"
                        type="checkbox"
                        checked={addUnitChecked}
                        onChange={() => setAddUnitChecked(!addUnitChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.unit.fields.addUnit.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editUnit"
                        name="editUnit"
                        type="checkbox"
                        checked={editUnitChecked}
                        onChange={() => setEditUnitChecked(!editUnitChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.unit.fields.editUnit.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteUnit"
                        name="deleteUnit"
                        type="checkbox"
                        checked={deleteUnitChecked}
                        onChange={() =>
                          setDeleteUnitChecked(!deleteUnitChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.unit.fields.deleteUnit.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Category */}
            {selectedOption === 'Category' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Category
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllCategory"
                        name="selectAllCategory"
                        type="checkbox"
                        checked={selectAllCategoryChecked}
                        onChange={handleSelectAllCategoryChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.category.fields.selectAllCategory.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewCategory"
                        name="viewCategory"
                        type="checkbox"
                        checked={viewCategoryChecked}
                        onChange={() =>
                          setViewCategoryChecked(!viewCategoryChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.category.fields.viewCategory.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addCategory"
                        name="addCategory"
                        type="checkbox"
                        checked={addCategoryChecked}
                        onChange={() =>
                          setAddCategoryChecked(!addCategoryChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.category.fields.addCategory.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editCategory"
                        name="editCategory"
                        type="checkbox"
                        checked={editCategoryChecked}
                        onChange={() =>
                          setEditCategoryChecked(!editCategoryChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.category.fields.editCategory.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteCategory"
                        name="deleteCategory"
                        type="checkbox"
                        checked={deleteCategoryChecked}
                        onChange={() =>
                          setDeleteCategoryChecked(!deleteCategoryChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.category.fields.deleteCategory.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Settings */}
            {selectedOption === 'Settings' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        Settings
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllSettings"
                        name="selectAllSettings"
                        type="checkbox"
                        checked={selectAllSettingsChecked}
                        onChange={handleSelectAllSettingsChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.settings.fields.selectAllSettings.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessBusinessSettings"
                        name="accessBusinessSettings"
                        type="checkbox"
                        checked={accessBusinessSettingsChecked}
                        onChange={() =>
                          setAccessBusinessSettingsChecked(
                            !accessBusinessSettingsChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.settings.fields.accessBusinessSettings.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessBarcodeSettings"
                        name="accessBarcodeSettings"
                        type="checkbox"
                        checked={accessBarcodeSettingsChecked}
                        onChange={() =>
                          setAccessBarcodeSettingsChecked(
                            !accessBarcodeSettingsChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.settings.fields.accessBarcodeSettings.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessInvoiceSettings"
                        name="accessInvoiceSettings"
                        type="checkbox"
                        checked={accessInvoiceSettingsChecked}
                        onChange={() =>
                          setAccessInvoiceSettingsChecked(
                            !accessInvoiceSettingsChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.settings.fields.accessInvoiceSettings.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessExpenses"
                        name="accessExpenses"
                        type="checkbox"
                        checked={accessExpensesChecked}
                        onChange={() =>
                          setAccessExpensesChecked(!accessExpensesChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.settings.fields.accessExpenses.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewOwnExpenses"
                        name="viewOwnExpenses"
                        type="checkbox"
                        checked={viewOwnExpensesChecked}
                        onChange={() =>
                          setViewOwnExpensesChecked(!viewOwnExpensesChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.settings.fields.accessInvoiceSettings.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessPrinters"
                        name="accessPrinters"
                        type="checkbox"
                        checked={accessPrintersChecked}
                        onChange={() =>
                          setAccessPrintersChecked(!accessPrintersChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.settings.fields.accessPrinters.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Home */}
            {selectedOption === 'Home' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.home.title'
                          )}`}
                          <div className="mx-1 ml-2 flex">
                            <FormInfo
                              toolagrisync={`${t(
                                'addUserManagementRoles.fields.permissions.fields.home.toolagrisync'
                              )}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewHomeData"
                        name="viewHomeData"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.home.fields.viewHomeData.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Account */}
            {selectedOption === 'Account' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        {`${t(
                          'addUserManagementRoles.fields.permissions.fields.account.title'
                        )}`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectAllAccounts"
                        name="selectAllAccounts"
                        type="checkbox"
                        checked={selectAllAccountsChecked}
                        onChange={handleSelectAllAccountsChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.account.fields.selectAllAccounts.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="listAccounts"
                        name="listAccounts"
                        type="checkbox"
                        checked={listAccountsChecked}
                        onChange={() =>
                          setListAccountsChecked(!listAccountsChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.account.fields.listAccounts.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="balanceSheet"
                        name="balanceSheet"
                        type="checkbox"
                        checked={balanceSheetChecked}
                        onChange={() =>
                          setBalanceSheetChecked(!balanceSheetChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.account.fields.balanceSheet.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="cashFlow"
                        name="cashFlow"
                        type="checkbox"
                        checked={cashFlowChecked}
                        onChange={() => setCashFlowChecked(!cashFlowChecked)}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.account.fields.cashFlow.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="paymentAccountReport"
                        name="paymentAccountReport"
                        type="checkbox"
                        checked={paymentAccountReportChecked}
                        onChange={() =>
                          setPaymentAccountReportChecked(
                            !paymentAccountReportChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.account.fields.paymentAccountReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewAllDateRange"
                        name="viewAllDateRange"
                        type="checkbox"
                        checked={viewAllDateRangeChecked}
                        onChange={() =>
                          setViewAllDateRangeChecked(!viewAllDateRangeChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.account.fields.viewAllDateRange.label'
                      )}`}</div>
                      <FormInfo
                        toolagrisync={`${t(
                          'addUserManagementRoles.fields.permissions.fields.account.fields.viewAllDateRange.toolagrisync'
                        )}`}
                      />
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* AccessSellingPriceGroups */}
            {selectedOption === 'AccessSellingPriceGroups' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.accessSellingPriceGroups.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="defaultSellingPrice"
                        name="defaultSellingPrice"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.accessSellingPriceGroups.fields.defaultSellingPrice.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="wholeSale"
                        name="wholeSale"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.accessSellingPriceGroups.fields.wholeSale.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="discountedSale"
                        name="discountedSale"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.accessSellingPriceGroups.fields.discountedSale.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Notification' */}
            {selectedOption === 'Notification' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.notification.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-1 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewPossBell"
                        name="viewPossBell"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.notification.fields.viewPossBell.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewKitchenAll"
                        name="viewKitchenAll"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.notification.fields.viewKitchenAll.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewKitchenCreateUser"
                        name="viewKitchenCreateUser"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.notification.fields.viewKitchenCreateUser.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewKitchenAssignUser"
                        name="viewKitchenAssignUser"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.notification.fields.viewKitchenAssignUser.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* AssetManagement' */}
            {selectedOption === 'AssetManagement' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.assetManagement.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-1 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewAsset"
                        name="viewAsset"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.assetManagement.fields.viewAsset.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewAllMaintenance"
                        name="viewAllMaintenance"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.assetManagement.fields.viewAllMaintenance.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewOwnMaintenance"
                        name="viewOwnMaintenance"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.assetManagement.fields.viewOwnMaintenance.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* COD' */}
            {selectedOption === 'COD' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.cod.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-1 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addCod"
                        name="addCod"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.cod.fields.addCod.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="syncInvoice"
                        name="syncInvoice"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.cod.fields.syncInvoice.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editSetAccount"
                        name="editSetAccount"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.cod.fields.editSetAccount.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* InternalIntegration' */}
            {selectedOption === 'InternalIntegration' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.internalIntegration.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  "></div>
              </div>
            )}
            {/* Manufacturing' */}
            {selectedOption === 'Manufacturing' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.manufacturing.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-1 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewRecipe"
                        name="viewRecipe"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.manufacturing.fields.viewRecipe.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addRecipe"
                        name="addRecipe"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.manufacturing.fields.addRecipe.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editRecipe"
                        name="editRecipe"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.manufacturing.fields.editRecipe.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessProduction"
                        name="accessProduction"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.manufacturing.fields.accessProduction.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* PromoCard' */}
            {selectedOption === 'PromoCard' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.promoCard.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewPromoDetails"
                        name="viewPromoDetails"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.promoCard.fields.viewPromoDetails.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addPromoCard"
                        name="addPromoCard"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.promoCard.fields.addPromoCard.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="activationPromoCard"
                        name="activationPromoCard"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.promoCard.fields.activationPromoCard.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="activationPromoCardDetails"
                        name="activationPromoCardDetails"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.promoCard.fields.activationPromoCardDetails.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editPromoCard"
                        name="editPromoCard"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.promoCard.fields.editPromoCard.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="setCustomerPromoCard"
                        name="setCustomerPromoCard"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.promoCard.fields.setCustomerPromoCard.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="activationCustomerPromoCode"
                        name="activationCustomerPromoCode"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.promoCard.fields.activationCustomerPromoCode.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Repair */}
            {selectedOption === 'Repair' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.repair.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addInvoice"
                        name="addInvoice"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.addInvoice.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editInvoice"
                        name="editInvoice"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.editInvoice.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewInvoice"
                        name="viewInvoice"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.viewInvoice.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteInvoice"
                        name="deleteInvoice"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.deleteInvoice.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="changeInvoiceStatus"
                        name="changeInvoiceStatus"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.changeInvoiceStatus.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addEditJobSheet"
                        name="addEditJobSheete"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.addEditJobSheet.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addJobSheet"
                        name="addJobSheet"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.addJobSheet.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editJobSheet"
                        name="editJobSheet"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.editJobSheet.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="addPartsToJobSheet"
                        name="addPartsToJobSheet"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.addPartsToJobSheet.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="deleteJobSheet"
                        name="deleteJobSheet"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.deleteJobSheet.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewOnlyAsignJobSheet"
                        name="viewOnlyAsignJobSheet"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.viewOnlyAsignJobSheet.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="viewAllJobSheet"
                        name="viewAllJobSheet"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.viewAllJobSheet.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="editRepairSettings"
                        name="editRepairSettings"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.repair.fields.editRepairSettings.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Shopify */}
            {selectedOption === 'Shopify' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.shopify.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="syncProductCategories"
                        name="syncProductCategories"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.shopify.fields.syncProductCategories.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="syncProducts"
                        name="syncProducts"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.shopify.fields.syncProducts.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="syncOrders"
                        name="syncOrders"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.shopify.fields.syncOrders.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="mapTaxRates"
                        name="mapTaxRates"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.shopify.fields.mapTaxRates.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessWoocommerceAPIsettings"
                        name="accessWoocommerceAPIsettings"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.shopify.fields.accessWoocommerceAPIsettings.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Superadmin */}
            {selectedOption === 'Superadmin' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.superadmin.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessPackageSubscriptions"
                        name="accessPackageSubscriptions"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.superadmin.fields.accessPackageSubscriptions.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Woocommerce */}
            {selectedOption === 'Woocommerce' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        <div className="flex">
                          {`${t(
                            'addUserManagementRoles.fields.permissions.fields.woocommerce.title'
                          )}`}
                          <div className="mx-1 ml-2 flex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="accessPackageSubscriptions"
                        name="accessPackageSubscriptions"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.woocommerce.fields.syncProductCategories.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="syncProducts"
                        name="syncProducts"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.woocommerce.fields.syncProducts.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="syncOrders"
                        name="syncOrders"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.woocommerce.fields.syncOrders.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="syncOrders"
                        name="syncOrders"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.woocommerce.fields.woocommerceMapTaxRates.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="syncOrders"
                        name="syncOrders"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.woocommerce.fields.accessWoocommerceAPISettings.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>
              </div>
            )}
            {/* Reports */}
            {selectedOption === 'Reports' && (
              <div className="flex h-full flex-col">
                <div className="flex flex-col border-b border-slate-200/60 px-5 py-4 dark:border-darkmode-400 sm:flex-row">
                  <div className="flex items-center">
                    <div className="ml-3 mr-auto">
                      <div className="text-base "></div>
                      <div className="text-xs font-medium sm:text-lg">
                        {`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.title'
                        )}`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 font-medium md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="selectPreliminaryReports"
                        name="selectPreliminaryReports"
                        type="checkbox"
                        checked={selectAllselectPreliminaryReportsChecked}
                        onChange={handleSelectAllselectPreliminaryReportsChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.selectPreliminaryReports.title'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="flex flex-col border-b border-slate-200/60 dark:border-darkmode-400 sm:flex-row">
                    <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="profitLossReport"
                          name="profitLossReport"
                          type="checkbox"
                          checked={profitLossReportChecked}
                          onChange={() =>
                            setProfitLossReportChecked(!profitLossReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.selectPreliminaryReports.fields.profitLossReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="registerReport"
                          name="registerReport"
                          type="checkbox"
                          checked={registerReportChecked}
                          onChange={() =>
                            setRegisterReportChecked(!registerReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.selectPreliminaryReports.fields.registerReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="expenseReport"
                          name="expenseReport"
                          type="checkbox"
                          checked={expenseReportChecked}
                          onChange={() =>
                            setExpenseReportChecked(!expenseReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.selectPreliminaryReports.fields.expenseReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="taxReport"
                          name="taxReport"
                          type="checkbox"
                          checked={taxReportChecked}
                          onChange={() =>
                            setTaxReportChecked(!taxReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.selectPreliminaryReports.fields.taxReport.label'
                        )}`}</div>
                      </FormCheck>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-9 grid grid-cols-1 gap-7 font-medium md:grid-cols-2 ">
                  <FormCheck className="py-1">
                    <FormCheck.Input
                      id="salesPurchase"
                      name="salesPurchase"
                      type="checkbox"
                      checked={selectAllsalesPurchaseChecked}
                      onChange={handleSelectAllsalesPurchaseChange}
                    />
                    <div className="ml-2 mr-2 ">{`${t(
                      'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.title'
                    )}`}</div>
                  </FormCheck>
                </div>
                <div className="flex flex-col border-b border-slate-200/60 dark:border-darkmode-400 sm:flex-row">
                  <div className="mb-3 ml-9 grid grid-cols-1 gap-7 py-5 md:grid-cols-2  ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="productPurchaseReport"
                        name="productPurchaseReport"
                        type="checkbox"
                        checked={productPurchaseReportChecked}
                        onChange={() =>
                          setProductPurchaseReportChecked(
                            !productPurchaseReportChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.productPurchaseReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="productSellReport"
                        name="productSellReport"
                        type="checkbox"
                        checked={productSellReportChecked}
                        onChange={() =>
                          setProductSellReportChecked(!productSellReportChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.productSellReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="dailySaleReport"
                        name="dailySaleReport"
                        type="checkbox"
                        checked={dailySaleReportChecked}
                        onChange={() =>
                          setDailySaleReportChecked(!dailySaleReportChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.dailySaleReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="locationWiseProductSellReport"
                        name="locationWiseProductSellReport"
                        type="checkbox"
                        checked={locationWiseProductSellReportChecked}
                        onChange={() =>
                          setLocationWiseProductSellReportChecked(
                            !locationWiseProductSellReportChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.locationWiseProductSellReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="purchasePaymentReport"
                        name="purchasePaymentReport"
                        type="checkbox"
                        checked={purchasePaymentReportChecked}
                        onChange={() =>
                          setPurchasePaymentReportChecked(
                            !purchasePaymentReportChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.purchasePaymentReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="sellPaymentReport"
                        name="sellPaymentReport"
                        type="checkbox"
                        checked={sellPaymentReportChecked}
                        onChange={() =>
                          setSellPaymentReportChecked(!sellPaymentReportChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.sellPaymentReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="chequeReport"
                        name="chequeReport"
                        type="checkbox"
                        checked={chequeReportChecked}
                        onChange={() =>
                          setChequeReportChecked(!chequeReportChecked)
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.chequeReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="purchaseSaleReport"
                        name="purchaseSaleReport"
                        type="checkbox"
                        checked={purchaseSaleReportChecked}
                        onChange={() =>
                          setPurchaseSaleReportChecked(
                            !purchaseSaleReportChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.purchaseSaleReport.label'
                      )}`}</div>
                    </FormCheck>
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="invoicePrintCountReport"
                        name="invoicePrintCountReport"
                        type="checkbox"
                        checked={invoicePrintCountReportChecked}
                        onChange={() =>
                          setInvoicePrintCountReportChecked(
                            !invoicePrintCountReportChecked
                          )
                        }
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.salesPurchase.fields.invoicePrintCountReport.label'
                      )}`}</div>
                    </FormCheck>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 font-medium md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="stockRelatedReports"
                        name="stockRelatedReports"
                        type="checkbox"
                        checked={selectAllStockRelatedReportsChecked}
                        onChange={handleSelectAllStockRelatedReportsChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.title'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="flex flex-col border-b border-slate-200/60 dark:border-darkmode-400 sm:flex-row">
                    <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="itemsReport"
                          name="itemsReport"
                          type="checkbox"
                          checked={itemsReportChecked}
                          onChange={() =>
                            setItemsReportChecked(!itemsReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.itemsReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="trendingProductsReport"
                          name="trendingProductsReport"
                          type="checkbox"
                          checked={trendingProductsReportChecked}
                          onChange={() =>
                            setTrendingProductsReportChecked(
                              !trendingProductsReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.trendingProductsReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="stockAdjustmentReport"
                          name="stockAdjustmentReport"
                          type="checkbox"
                          checked={stockAdjustmentReportChecked}
                          onChange={() =>
                            setStockAdjustmentReportChecked(
                              !stockAdjustmentReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.stockAdjustmentReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="stockMovementReport"
                          name="stockMovementReport"
                          type="checkbox"
                          checked={stockMovementReportChecked}
                          onChange={() =>
                            setStockMovementReportChecked(
                              !stockMovementReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.stockMovementReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="bartenderReport"
                          name="bartenderReport"
                          type="checkbox"
                          checked={bartenderReportChecked}
                          onChange={() =>
                            setBartenderReportChecked(!bartenderReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.bartenderReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="stockReport"
                          name="stockReport"
                          type="checkbox"
                          checked={stockReportChecked}
                          onChange={() =>
                            setStockReportChecked(!stockReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.stockReport.label'
                        )}`}</div>
                      </FormCheck>

                      <FormCheck className="">
                        <FormCheck.Input
                          id="stockExpiryReport"
                          name="stockExpiryReport"
                          type="checkbox"
                          checked={stockExpiryReportChecked}
                          onChange={() =>
                            setStockExpiryReportChecked(
                              !stockExpiryReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.stockExpiryReport.label'
                        )}`}</div>
                        <FormCheck.Label
                          className="mr-2"
                          htmlFor="vertical-form-3"
                        >
                          <div className="mx-1 -ml-1 flex">
                            <FormInfo
                              toolagrisync={`${t(
                                'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.stockExpiryReport.toolagrisync'
                              )}`}
                            />
                          </div>
                        </FormCheck.Label>
                      </FormCheck>

                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="lotReport"
                          name="lotReport"
                          type="checkbox"
                          checked={lotReportChecked}
                          onChange={() =>
                            setLotReportChecked(!lotReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.lotReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="locationWiseStockReport"
                          name="locationWiseStockReport"
                          type="checkbox"
                          checked={locationWiseStockReportChecked}
                          onChange={() =>
                            setLocationWiseStockReportChecked(
                              !locationWiseStockReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.locationWiseStockReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="dateWiseStockReport"
                          name="dateWiseStockReport"
                          type="checkbox"
                          checked={dateWiseStockReportChecked}
                          onChange={() =>
                            setDateWiseStockReportChecked(
                              !dateWiseStockReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.dateWiseStockReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="supplierWiseAlertStock"
                          name="supplierWiseAlertStock"
                          type="checkbox"
                          checked={supplierWiseAlertStockChecked}
                          onChange={() =>
                            setSupplierWiseAlertStockChecked(
                              !supplierWiseAlertStockChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.stockRelatedReports.fields.supplierWiseAlertStock.label'
                        )}`}</div>
                      </FormCheck>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 font-medium md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="userContactsReports"
                        name="userContactsReports"
                        type="checkbox"
                        checked={selectAlluserContactsReportsChecked}
                        onChange={handleSelectAlluserContactsReportsChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.userContactsReports.title'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="flex flex-col border-b border-slate-200/60 dark:border-darkmode-400 sm:flex-row">
                    <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="supplierCustomerReport"
                          name="supplierCustomerReport"
                          type="checkbox"
                          checked={supplierCustomerReportChecked}
                          onChange={() =>
                            setSupplierCustomerReportChecked(
                              !supplierCustomerReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.userContactsReports.fields.supplierCustomerReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="customerGroupsReport"
                          name="customerGroupsReport"
                          type="checkbox"
                          checked={customerGroupsReportChecked}
                          onChange={() =>
                            setCustomerGroupsReportChecked(
                              !customerGroupsReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.userContactsReports.fields.customerGroupsReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="salesRepresentativeReport"
                          name="salesRepresentativeReport"
                          type="checkbox"
                          checked={salesRepresentativeReportChecked}
                          onChange={() =>
                            setSalesRepresentativeReportChecked(
                              !salesRepresentativeReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.userContactsReports.fields.salesRepresentativeReport.label'
                        )}`}</div>
                      </FormCheck>

                      <FormCheck className="">
                        <FormCheck.Input
                          id="fixedSalesCommission"
                          name="fixedSalesCommission"
                          type="checkbox"
                          checked={fixedSalesCommissionChecked}
                          onChange={() =>
                            setFixedSalesCommissionChecked(
                              !fixedSalesCommissionChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.userContactsReports.fields.fixedSalesCommission.label'
                        )}`}</div>
                        <FormCheck.Label
                          className="mr-2"
                          htmlFor="vertical-form-3"
                        >
                          <div className="mx-1 -ml-1 flex">
                            <FormInfo
                              toolagrisync={`${t(
                                'addUserManagementRoles.fields.permissions.fields.reports.fields.userContactsReports.fields.fixedSalesCommission.toolagrisync'
                              )}`}
                            />
                          </div>
                        </FormCheck.Label>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="agingReport"
                          name="agingReport"
                          type="checkbox"
                          checked={agingReportChecked}
                          onChange={() =>
                            setAgingReportChecked(!agingReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.userContactsReports.fields.agingReport.label'
                        )}`}</div>
                      </FormCheck>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3 py-8 ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 font-medium md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="cODReports"
                        name="cODReports"
                        type="checkbox"
                        checked={selectAllcODReportsChecked}
                        onChange={handleSelectAllcODReportsChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.cODReports.title'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="flex flex-col border-b border-slate-200/60 dark:border-darkmode-400 sm:flex-row">
                    <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="trasExpressCODReport"
                          name="trasExpressCODReport"
                          type="checkbox"
                          checked={trasExpressCODReportChecked}
                          onChange={() =>
                            setTrasExpressCODReportChecked(
                              !trasExpressCODReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.cODReports.fields.trasExpressCODReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="koombiyoCODReport"
                          name="koombiyoCODReport"
                          type="checkbox"
                          checked={koombiyoCODReportChecked}
                          onChange={() =>
                            setKoombiyoCODReportChecked(
                              !koombiyoCODReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.cODReports.fields.koombiyoCODReport.label'
                        )}`}</div>
                      </FormCheck>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-3  ">
                  <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 font-medium md:grid-cols-2 ">
                    <FormCheck className="py-1">
                      <FormCheck.Input
                        id="restaurantReports"
                        name="restaurantReports"
                        type="checkbox"
                        checked={selectAllrestaurantReportsChecked}
                        onChange={handleSelectAllrestaurantReportsChange}
                      />
                      <div className="ml-2 mr-2 ">{`${t(
                        'addUserManagementRoles.fields.permissions.fields.reports.fields.restaurantReports.title'
                      )}`}</div>
                    </FormCheck>
                  </div>
                  <div className="flex flex-col border-b border-slate-200/60 dark:border-darkmode-400 sm:flex-row">
                    <div className="mb-3 ml-6 grid grid-cols-1 gap-7 py-2 md:grid-cols-2  ">
                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="kitchenReport"
                          name="kitchenReport"
                          type="checkbox"
                          checked={kitchenReportChecked}
                          onChange={() =>
                            setKitchenReportChecked(!kitchenReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.restaurantReports.fields.kitchenReport.label'
                        )}`}</div>
                      </FormCheck>
                      <FormCheck className="">
                        <FormCheck.Input
                          id="serviceStaffReport"
                          name="serviceStaffReport"
                          type="checkbox"
                          checked={serviceStaffReportChecked}
                          onChange={() =>
                            setServiceStaffReportChecked(
                              !serviceStaffReportChecked
                            )
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.restaurantReports.fields.serviceStaffReport.label'
                        )}`}</div>
                        <FormCheck.Label
                          className="mr-2"
                          htmlFor="vertical-form-3"
                        >
                          <div className="mx-1 -ml-1 flex">
                            <FormInfo
                              toolagrisync={`${t(
                                'addUserManagementRoles.fields.permissions.fields.reports.fields.restaurantReports.fields.serviceStaffReport.toolagrisync'
                              )}`}
                            />
                          </div>
                        </FormCheck.Label>
                      </FormCheck>

                      <FormCheck className="py-1">
                        <FormCheck.Input
                          id="tableReport"
                          name="tableReport"
                          type="checkbox"
                          checked={tableReportChecked}
                          onChange={() =>
                            setTableReportChecked(!tableReportChecked)
                          }
                        />
                        <div className="ml-2 mr-2 ">{`${t(
                          'addUserManagementRoles.fields.permissions.fields.reports.fields.restaurantReports.fields.tableReport.label'
                        )}`}</div>
                      </FormCheck>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* BEGIN: Chat Default */}
            {chatBox && ( // Use chatBox state to conditionally render the default chatbox
              <div className="flex h-[550px] items-center">
                <div className="mx-auto text-center">
                  <div className="image-fit mx-auto h-16 w-16 flex-none overflow-hidden rounded-full">
                    {/* Add an image or icon here if desired */}
                  </div>
                  <div className="">
                    <div className="font-medium">Hey,</div>
                    <div className="text-slate-500">Please select a Role</div>
                  </div>
                </div>
              </div>
            )}
            {/* END: Chat Default */}
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddRole
