interface ICustomerCreateReq {
  type: string
  supplier_business_name?: string
  prefix: string
  first_name: string
  middle_name?: string
  last_name?: string
  tax_number?: string
  pay_term_number?: string
  pay_term_type?: string
  mobile: string
  landline?: string
  alternate_number?: string
  city?: string
  state?: string
  country?: string
  address_line_1?: string
  address_line_2?: string
  customer_group_id?: number
  zip_code?: string
  contact_id?: number
  custom_field1?: string
  custom_field2?: string
  custom_field3?: string
  custom_field4?: string
  custom_field5?: string
  custom_field6?: string
  custom_field7?: string
  custom_field8?: string
  custom_field9?: string
  custom_field10?: string
  email?: string
  shipping_address?: string
  position?: string
  dob?: string
}

interface ICustomerCreateRes {
  type: string
  supplier_business_name?: string
  prefix: string
  first_name: string
  middle_name?: string
  last_name?: string
  tax_number?: string
  pay_term_number?: string
  pay_term_type?: string
  mobile: string
  landline?: string
  alternate_number?: string
  city?: string
  state?: string
  country?: string
  address_line_1?: string
  address_line_2?: string
  customer_group_id?: number
  zip_code?: string
  contact_id?: number
  custom_field1?: string
  custom_field2?: string
  custom_field3?: string
  custom_field4?: string
  custom_field5?: string
  custom_field6?: string
  custom_field7?: string
  custom_field8?: string
  custom_field9?: string
  custom_field10?: string
  email?: string
  shipping_address?: string
  position?: string
  dob?: string
  name?: string
  business_id?: number
  created_by: number
  credit_limit?: number
  updated_at: string
  created_at: string
  id: number
}

interface IProductListRes {
  enable_stock: number
  id: number
  media: []
  name: string
  product_id: number
  product_image?: string
  qty_available: number
  selling_price: number
  short_name: string
  sub_sku: string
  type: string
  variation: string
  kot: string
}

export type { ICustomerCreateReq, ICustomerCreateRes, IProductListRes }
