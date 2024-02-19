import {
  Skeleton,
  Table,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { TableBody } from "react-stately";
import { WeatherIcon } from "../WeatherIcon/WeatherIcon";
import { isoToTime } from "../../weather/utils";
import { City } from "../../weather/weatherTypes";

interface Column {
  key:
    | "timestamp"
    | "temperature"
    | "wind_speed"
    | "condition"
    | "icon"
    | "precipitation"
    | "precipitation_probability";
  label: string;
  allowsSorting?: boolean;
}

export function WeatherTable({ city }: { city: City }) {
  const { weather } = city;
  const isLoading = weather?.isLoading;

  if (isLoading) {
    const rows = 4;
    const cols = 4;

    return (
      <>
        <p className="sr-only p-4">Lade Daten...</p>

        <div aria-hidden="true" className="space-y-2 p-4">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-6 w-full" />
              ))}
            </div>
          ))}
        </div>
      </>
    );
  }

  if (weather?.data == null) {
    return <p className="p-4">Keine Daten vorhanden.</p>;
  }

  const tableColumns: Column[] = [
    {
      key: "icon",
      label: "Symbol",
    },
    {
      key: "timestamp",
      label: "Zeitpunkt",
      allowsSorting: true,
    },
    {
      key: "temperature",
      label: "Temperatur",
      allowsSorting: true,
    },
    {
      key: "wind_speed",
      label: "Windgeschwindigkeit",
    },
    {
      key: "condition",
      label: "Wetterlage",
    },
    {
      key: "precipitation",
      label: "Niederschlag",
    },
    {
      key: "precipitation_probability",
      label: "Niederschlagswahrscheinlichkeit",
    },
  ];

  return (
    <Table aria-label="Wetterbericht" shadow="none" isStriped>
      <TableHeader>
        {tableColumns.map((column) => {
          return (
            <TableColumn
              align="start"
              key={column.key}
              allowsSorting={column.allowsSorting}
            >
              {column.label}
            </TableColumn>
          );
        })}
      </TableHeader>
      <TableBody>
        {weather.data.map((row, i) => {
          return (
            <TableRow key={i}>
              {tableColumns.map((column, j) => {
                const value = row[column.key];

                // API can return 0 as a valid value
                if (value === null || value === undefined) {
                  return (
                    <TableCell align="left" key={j} className="italic">
                      N/A
                    </TableCell>
                  );
                }

                let formattedValue = value;

                if (column.key === "timestamp") {
                  formattedValue = isoToTime(value as string);
                  // check if current date is today
                  const isValueToday =
                    new Date(value as string).toDateString() ===
                    new Date().toDateString();

                  if (isValueToday) {
                    formattedValue = `Heute, ${formattedValue}`;
                  } else {
                    const weekday = new Date(
                      value as string,
                    ).toLocaleDateString("de-DE", { weekday: "long" });
                    formattedValue = `${weekday}, ${formattedValue}`;
                  }
                }
                if (column.key === "temperature") {
                  formattedValue = `${value}°C`;
                }
                if (column.key === "wind_speed") {
                  formattedValue = `${value} km/h`;
                }
                if (column.key === "precipitation") {
                  formattedValue = `${value} mm`;
                }
                if (column.key === "precipitation_probability") {
                  formattedValue = `${value}%`;
                }
                if (column.key === "icon") {
                  return (
                    <TableCell align="left" key={j}>
                      <WeatherIcon weatherResult={row} />
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell align="left" key={j} className="py-4">
                      {formattedValue}
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
