/* eslint-disable no-console */
/* eslint-disable no-script-url */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import Lucide from "../../base-components/lucide";
import Button from "../../components/common/button";
import { FormInput, FormSelect } from "../../components/common/form-elements/components";
import * as xlsx from "xlsx"
import { useEffect,useState, useRef, createRef } from "react";
import { createIcons, icons } from "lucide"
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { stringToHTML } from "../../utils/helper";
import {  Menu } from "../../components/common/headless";

interface Response {
  name?: string;
  category?: string;
  images?: string[];
  status?: string;
}

function Main() {
  const tableRef = createRef<HTMLDivElement>();
  const tabulator = useRef<Tabulator>();
  const [filter, setFilter] = useState({
    field: "name",
    type: "like",
    value: "",
  });

  const imageAssets = import.meta.glob<{
    default: string;
  }>("/src/assets/images/fakers/*.{jpg,jpeg,png,svg}", { eager: true });
  const initTabulator = () => {
    if (tableRef.current) {
      tabulator.current = new Tabulator(tableRef.current, {
        ajaxURL: "https://dummy-data.left4code.com",
        paginationMode: "remote",
        // filterMode: "remote",
        // sortMode: "remote",
        printAsHtml: true,
        printStyled: true,
        pagination: true,
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        placeholder: "No matching records found",
        columns: [
          {
            title: "",
            formatter: "responsiveCollapse",
            width: 40,
            minWidth: 30,
            hozAlign: "center",
            resizable: false,
            headerSort: false,
          },
          

          // For HTML table
          {
            title: "PRODUCT NAME",
            minWidth: 200,
            responsive: 0,
            field: "name",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
              const response: Response = cell.getData();
              return `<div>
                <div class="font-medium whitespace-nowrap">${response.name}</div>
                <div class="text-slate-500 text-xs whitespace-nowrap">${response.category}</div>
              </div>`;
            },
          },
          
          {
            title: "REMAINING STOCK",
            minWidth: 200,
            field: "remaining_stock",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          
          {
            title: "STATUS",
            minWidth: 200,
            field: "status",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
              const response: Response = cell.getData();
              return `<div class="flex items-center lg:justify-center ${
                response.status ? "text-success" : "text-danger"
              }">
                <i data-lucide="check-square" class="w-4 h-4 mr-2"></i> ${
                  response.status ? "Active" : "Inactive"
                }
              </div>`;
            },
          },
          {
            title: "ACTIONS",
            minWidth: 200,
            field: "actions",
            responsive: 1,
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell, formatterParams, onRendered) {
              const actionsContainer = document.createElement("div");
              actionsContainer.classList.add("flex", "lg:justify-center", "items-center");
          
              
              const actionButton = document.createElement("a");
              actionButton.classList.add("flex", "items-center", "mr-3");
              actionButton.href = "javascript:;";
              
              const menuButton = document.createElement("button");
              menuButton.className = "h-8 w-16";
              menuButton.innerText = "Action";
              
              const chevronIcon = document.createElement("span");
              chevronIcon.className = "w-4 h-4 ml-2";
              chevronIcon.textContent = "▼";
          
              menuButton.appendChild(chevronIcon);
              actionButton.appendChild(menuButton);
              actionsContainer.appendChild(actionButton);
              
              // ... (previous code)

              const menuItems = document.createElement("div");
              menuItems.className = "menu-tab hidden w-52 h-48 overflow-y-auto"; // Add the "menu-tab" class

          
              const menuItemLabels = [
                "Labels",
                "View",
                "Edit",
                "Delete",
                "Add or Edit Opening Stock",
                "Product Stock History",
                "Add or Edit Group Prices",
                "Duplicate Product"
              ];
          
              menuItemLabels.forEach(label => {
                const menuItem = document.createElement("div");
                menuItem.className = "menu-item"; // Apply the "menu-item" class here
                menuItem.textContent = label;
                menuItems.appendChild(menuItem);
              
                menuItem.addEventListener("click", function () {
                  // Handle menu item click here
                  console.log("Clicked on:", label);
              
                  // Hide the menu after clicking
                  menuItems.classList.add("hidden");
                });
              });
          
              actionsContainer.appendChild(menuItems);
          
              actionButton.addEventListener("click", function () {
                menuItems.classList.toggle("hidden");
              });
          
              return actionsContainer;
            },
          },
          // For print format
          {
            title: "PRODUCT NAME",
            field: "name",
            visible: false,
            print: true,
            download: true,
          },
          {
            title: "CATEGORY",
            field: "category",
            visible: false,
            print: true,
            download: true,
          },
          {
            title: "REMAINING STOCK",
            field: "remaining_stock",
            visible: false,
            print: true,
            download: true,
          },
          {
            title: "STATUS",
            field: "status",
            visible: false,
            print: true,
            download: true,
            formatterPrint(cell) {
              return cell.getValue() ? "Active" : "Inactive";
            },
          },
          {
            title: "IMAGE 1",
            field: "images",
            visible: false,
            print: true,
            download: true,
            formatterPrint(cell) {
              return cell.getValue()[0];
            },
          },
          {
            title: "IMAGE 2",
            field: "images",
            visible: false,
            print: true,
            download: true,
            formatterPrint(cell) {
              return cell.getValue()[1];
            },
          },
          {
            title: "IMAGE 3",
            field: "images",
            visible: false,
            print: true,
            download: true,
            formatterPrint(cell) {
              return cell.getValue()[2];
            },
          },
        ],
      });
    }

    tabulator.current?.on("renderComplete", () => {
      createIcons({
        icons,
        attrs: {
          "stroke-width": 1.5,
        },
        nameAttr: "data-lucide",
      });
    });
  };

  // Redraw table onresize
  const reInitOnResizeWindow = () => {
    window.addEventListener("resize", () => {
      if (tabulator.current) {
        tabulator.current.redraw();
        createIcons({
          icons,
          attrs: {
            "stroke-width": 1.5,
          },
          nameAttr: "data-lucide",
        });
      }
    });
  };

  // Filter function
  const onFilter = () => {
    if (tabulator.current) {
      tabulator.current.setFilter(filter.field, filter.type, filter.value);
    }
  };

  // On reset filter
  const onResetFilter = () => {
    setFilter({
      ...filter,
      field: "name",
      type: "like",
      value: "",
    });
    onFilter();
  };

  // Export
  const onExportCsv = () => {
    if (tabulator.current) {
      tabulator.current.download("csv", "data.csv");
    }
  };

  const onExportJson = () => {
    if (tabulator.current) {
      tabulator.current.download("json", "data.json");
    }
  };

  const onExportXlsx = () => {
    if (tabulator.current) {
      (window as any).XLSX = xlsx;
      tabulator.current.download("xlsx", "data.xlsx", {
        sheetName: "Products",
      });
    }
  };

  const onExportHtml = () => {
    if (tabulator.current) {
      tabulator.current.download("html", "data.html", {
        style: true,
      });
    }
  };

  // Print
  const onPrint = () => {
    if (tabulator.current) {
      tabulator.current.print();
    }
  };

  useEffect(() => {
    initTabulator();
    reInitOnResizeWindow();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Tabulator</h2>
        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
          <Button variant="primary" className="mr-2 shadow-md">
            Add New Product
          </Button>
          <Menu className="ml-auto sm:ml-0">
            <Menu.Button as={Button} className="px-2 font-normal !box">
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="FilePlus" className="w-4 h-4 mr-2" /> New Category
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="UserPlus" className="w-4 h-4 mr-2" /> New Group
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      {/* BEGIN: HTML Table Data */}
      <div className="p-5 mt-5 intro-y box">
        <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
          <form
            id="tabulator-html-filter-form"
            className="xl:flex sm:mr-auto"
            onSubmit={(e) => {
              e.preventDefault();
              onFilter();
            }}
          >
            <div className="items-center sm:flex sm:mr-4">
              <label className="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
                Field
              </label>
              <FormSelect
                id="tabulator-html-filter-field"
                value={filter.field}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    field: e.target.value,
                  });
                }}
                className="w-full mt-2 2xl:w-full sm:mt-0 sm:w-auto"
              >
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="remaining_stock">Remaining Stock</option>
              </FormSelect>
            </div>
            <div className="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
              <label className="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
                Type
              </label>
              <FormSelect
                id="tabulator-html-filter-type"
                value={filter.type}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    type: e.target.value,
                  });
                }}
                className="w-full mt-2 sm:mt-0 sm:w-auto"
              >
                <option value="like">like</option>
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
                <option value=">">&gt;</option>
                <option value=">=">&gt;=</option>
                <option value="!=">!=</option>
              </FormSelect>
            </div>
            <div className="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
              <label className="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
                Value
              </label>
              <FormInput
                id="tabulator-html-filter-value"
                value={filter.value}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    value: e.target.value,
                  });
                }}
                type="text"
                className="mt-2 sm:w-40 2xl:w-full sm:mt-0"
                placeholder="Search..."
              />
            </div>
            <div className="mt-2 xl:mt-0">
              <Button
                id="tabulator-html-filter-go"
                variant="primary"
                type="button"
                className="w-full sm:w-16"
                onClick={onFilter}
              >
                Go
              </Button>
              <Button
                id="tabulator-html-filter-reset"
                variant="secondary"
                type="button"
                className="w-full mt-2 sm:w-16 sm:mt-0 sm:ml-1"
                onClick={onResetFilter}
              >
                Reset
              </Button>
            </div>
          </form>
          <div className="flex mt-5 sm:mt-0">
            <Button
              id="tabulator-print"
              variant="outline-secondary"
              className="w-1/2 mr-2 sm:w-auto"
              onClick={onPrint}
            >
              <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
            </Button>
            <Menu className="w-1/2 sm:w-auto">
              <Menu.Button
                as={Button}
                variant="outline-secondary"
                className="w-full sm:w-auto"
              >
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                <Lucide
                  icon="ChevronDown"
                  className="w-4 h-4 ml-auto sm:ml-2"
                />
              </Menu.Button>
              <Menu.Items className="w-40">
                <Menu.Item onClick={onExportCsv}>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export CSV
                </Menu.Item>
                <Menu.Item onClick={onExportJson}>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                  JSON
                </Menu.Item>
                <Menu.Item onClick={onExportXlsx}>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                  XLSX
                </Menu.Item>
                <Menu.Item onClick={onExportHtml}>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                  HTML
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hidden">
          <div id="tabulator" ref={tableRef} className="mt-5"></div>
        </div>
      </div>
      {/* END: HTML Table Data */}
    </>
  );
}

export default Main;
