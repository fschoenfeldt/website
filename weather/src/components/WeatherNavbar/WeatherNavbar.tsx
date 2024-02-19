import { faArrowLeft, faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import { useState } from "react";
import { toLocalISOString } from "../../weather/utils";
import { City } from "../../weather/weatherTypes";

export function WeatherNavbar({
  selectedCity,
  setSelectedCity,
  selectedDate,
  onSelectDate,
  isEditingDate,
  setIsEditingDate,
}: {
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  isEditingDate: boolean;
  setIsEditingDate: (isEditingDate: boolean) => void;
}) {
  /*  const [isMenuOpen, setIsMenuOpen] = useState(false); */
  const [intermediateDate, setIntermediateDate] = useState<Date>(
    selectedDate || new Date(),
  );

  return (
    <Navbar maxWidth="full" className="bg-green-800 h-24 text-gray-100">
      <NavbarContent>
        {/* <NavbarMenuToggle
              aria-label={isMenuOpen ? "Menü öffnen" : "Menü schließen"}
              className="sm:hidden"
            /> */}
        <NavbarBrand className="flex gap-4 sm:gap-6">
          {selectedCity && (
            <Button
              variant="bordered"
              onPress={() => setSelectedCity(null)}
              startContent={
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size="xs"
                  className="text-white"
                />
              }
            >
              <span className="sr-only text-white md:not-sr-only">
                Andere Stadt wählen
              </span>
            </Button>
          )}

          <div className="whitespace-break-spaces">
            Wettervorhersage
            {selectedCity && (
              <>
                {" "}
                für <span className="font-bold">{selectedCity.name}</span>
              </>
            )}
            {selectedDate && (
              <>
                {" "}
                am{" "}
                {isEditingDate ? (
                  <form action="#" className="inline-flex items-center gap-2">
                    <Input
                      className=""
                      type="datetime-local"
                      value={toLocalISOString(intermediateDate).slice(0, 16)}
                      min={toLocalISOString(new Date()).slice(0, 16)}
                      // maximum: 2 weeks in the future
                      max={toLocalISOString(
                        new Date(Date.now() + 1209600000),
                      ).slice(0, 16)}
                      onValueChange={(value) => {
                        setIntermediateDate(new Date(value));
                      }}
                    />
                    <Button
                      type="submit"
                      variant="bordered"
                      isIconOnly
                      onPress={() => {
                        if (intermediateDate) {
                          onSelectDate(intermediateDate);
                          setIsEditingDate(false);
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        size="xs"
                        className="text-white"
                      />
                    </Button>
                  </form>
                ) : (
                  <span className="space-x-2 font-bold">
                    <span>
                      {selectedDate.toLocaleDateString("de-DE", {
                        year: "numeric",
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Button
                      variant="faded"
                      onPress={() => setIsEditingDate(true)}
                      aria-label="Datum bearbeiten"
                      size="sm"
                      isIconOnly
                    >
                      <FontAwesomeIcon icon={faPen} size="xs" />
                    </Button>
                  </span>
                )}
              </>
            )}
          </div>
        </NavbarBrand>
      </NavbarContent>
    </Navbar>
  );
}
