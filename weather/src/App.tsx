import { useState, useMemo } from "react";
import { useAsyncList } from "react-stately";
import { AsyncListData } from "react-stately";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import "./App.css";

function App() {
  let list = useAsyncList({
    async load({ signal, cursor }) {
      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      let res = await fetch(cursor || "https://pokeapi.co/api/v2/pokemon", {
        signal,
      });
      let json = await res.json();
      return {
        items: json.results,
        cursor: json.next,
      };
    },
  });

  return (
    <>
      {/* <Picker
        label="Pick a Pokemon"
        items={list.items}
        isLoading={list.isLoading}
        onLoadMore={list.loadMore}
      >
        {(item) => <Item key={item.name}>{item.name}</Item>}
      </Picker> */}
      <h1>Hello world!</h1>
      <Kennzahlen kennzahlen={kennzahlenMock} />
    </>
  );
}

function Kennzahlen({ kennzahlen }) {
  // const [filterValue, setFilterValue] = useState("");

  const memoKennzahlen = useAsyncList({
    async load({ signal, cursor }) {
      return {
        items: kennzahlen,
      };
    },
    async sort({ items, sortDescriptor }) {
      console.debug({ sortDescriptor });
      const sortedItems = [...items].sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        let cmp =
          (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }

        return cmp;
      });
      return {
        items: sortedItems,
        sortDescriptor,
      };
    },
  });

  /*   const memoKennzahlen = useMemo(() => {
    let filteredKennzahlen = [...kennzahlen];

    if (filterValue) {
      filteredKennzahlen = filteredKennzahlen.filter((kennzahl) => {
        return Object.values(kennzahl).some((value) => {
          return value
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        });
      });
    }

    return filteredKennzahlen;
  }, [kennzahlen, filterValue]);
 */
  return (
    <>
      <h2>Kennzahlen</h2>
      <div>
        <TableFilterHeader memoKennzahlen={memoKennzahlen} />
        <MyTable data={memoKennzahlen} tableAriaLabel={"Kennzahlen"} />
      </div>
    </>
  );
}

function MyTable({
  data,
  tableAriaLabel,
}: {
  data: AsyncListData<Array<object>>;
  tableAriaLabel: string;
}) {
  const { items } = data;
  if (items.length == 0) {
    return <p>Keine Daten vorhanden.</p>;
  }

  const tableHeaders = Object.keys(items[0]);

  return (
    <Table
      onSortChange={data.sort}
      aria-label={tableAriaLabel}
      sortDescriptor={data.sortDescriptor}
    >
      <TableHeader>
        {tableHeaders.map((header, index) => {
          return (
            <TableColumn align="start" key={header} allowsSorting>
              {header}
            </TableColumn>
          );
        })}
      </TableHeader>
      <TableBody>
        {items.map((row) => {
          return (
            <TableRow key={row.id}>
              {tableHeaders.map((header, index) => {
                const value = row[header];

                return value ? (
                  <TableCell align="left" key={index}>
                    {value}
                  </TableCell>
                ) : (
                  <TableCell
                    align="left"
                    key={index}
                    className="bg-gray-100 italic dark:bg-gray-800"
                  >
                    N/A
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function TableFilterHeader({ memoKennzahlen }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        isClearable
        placeholder="Suche"
        startContent="🔍"
        size="sm"
        value={memoKennzahlen.filterValue}
        onValueChange={memoKennzahlen.setFilterValue}
      />
      <Dropdown aria-label="Filter">
        <DropdownTrigger>
          <Button variant="bordered">Filter</Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Filter Optionen">
          <DropdownItem>Lorem</DropdownItem>
          <DropdownItem>Ipsum</DropdownItem>
          <DropdownItem>Dolor</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

const kennzahlenMock = [
  {
    id: 1,
    name: "Vertragsentwurf",
    version: "vorläufig",
    status: "abgelegt",
    date: "2022-01-01",
  },
  {
    id: 2,
    name: "Jahresbericht 2021",
    version: "testiert",
    status: "abgelegt",
    date: "2022-01-02",
  },
  {
    id: 3,
    name: "Projektplan Q1",
    version: "vorläufig",
    status: "nicht abgelegt",
    date: "2022-01-03",
  },
  {
    id: 4,
    name: "Marketingstrategie 2022",
    version: "testiert",
    status: "nicht abgelegt",
    date: "2022-01-04",
  },
  {
    id: 5,
    name: "Finanzplan 2022",
    version: "vorläufig",
    status: "abgelegt",
    date: "2022-01-05",
  },
  {
    id: 6,
    name: "Produktkatalog Sommer",
    version: "testiert",
    status: "nicht abgelegt",
    date: "2022-01-06",
  },
  {
    id: 7,
    name: "Personalplan 2022",
    version: "vorläufig",
    status: "abgelegt",
    date: "2022-01-07",
  },
  {
    id: 8,
    name: "Kundenfeedback Q4",
    version: "testiert",
    status: "nicht abgelegt",
    date: "2022-01-08",
  },
  {
    id: 9,
    name: "Verkaufsbericht Dezember",
    version: "vorläufig",
    status: "abgelegt",
    date: "2022-01-09",
  },
  {
    id: 10,
    name: "Lieferantenvertrag",
    version: "testiert",
    /*     status: "nicht abgelegt", */
    date: "2022-01-10",
  },
];

export default App;
