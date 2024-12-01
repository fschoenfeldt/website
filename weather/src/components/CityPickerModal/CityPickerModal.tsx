import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { AppDispatch } from "../../weather/store";
import { City } from "../../weather/weatherTypes";
import { CityPicker } from "./CityPicker/CityPicker";

export function CityPickerModal({
  isCityPickerOpen,
  onCityPickerOpenChange,
  cities,
  selectedDate,
  dispatch,
}: {
  isCityPickerOpen: boolean;
  onCityPickerOpenChange: (isOpen: boolean) => void;
  cities: City[];
  selectedDate: Date;
  dispatch: AppDispatch;
}) {
  return (
    <Modal isOpen={isCityPickerOpen} onOpenChange={onCityPickerOpenChange}>
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader>Neue Stadt hinzufügen</ModalHeader>
            <ModalBody>
              <CityPicker
                cities={cities}
                dispatch={dispatch}
                selectedDate={selectedDate}
                onCityPickerSubmit={() => {
                  closeModal();
                }}
              />
            </ModalBody>
            <ModalFooter>
              {/* <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
