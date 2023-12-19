import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useReducer, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import reducer, {
  DtoToStateType,
  StateToCreateDto,
  VacationsInitial,
} from "./reducer";
import dayjs from "dayjs";
import { DateFormatString } from "../../../../constants/DateFormat";
import axios from "axios";
import { Api } from "../../../../constants";
import { getDateDiffNegativeAllowed } from "../../../../methods";
import { EmployeeType, Vacation } from "../../../../types";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { ToasterType } from "../../../../types/other/ToasterStateType";

const PopupVacations = (props: PropsType) => {
  const [vacationForm, dispatch] = useReducer(reducer, VacationsInitial);
  const [formStatus, setFormStatus] = useState<"loading" | "none" | "error">(
    "none"
  );
  console.log(vacationForm);
  const { yearId } = useParams();
  const numberOfDays =
    Math.round(
      getDateDiffNegativeAllowed(
        new Date(vacationForm.date_to),
        new Date(vacationForm.date_from)
      ) /
        (1000 * 60 * 60 * 24)
    ) || 0;
  const ActionIsUpdate = !!props.InitialVacationData;
  const isValidDateRange = numberOfDays > 0;
  const toShow =
    typeof numberOfDays === "number" && numberOfDays > 0
      ? numberOfDays
      : "برجاء ادخال فترة اجازة صحيحة";
  useEffect(() => {
    if (ActionIsUpdate && !!props.InitialVacationData)
      dispatch({
        type: "SET_ALL",
        payload: DtoToStateType(props.InitialVacationData),
      });
    else dispatch({ type: "SET_RESET", payload: undefined });
  }, [ActionIsUpdate, props?.InitialVacationData?.id]);
  const setVacation = () => {
    if (yearId) {
      if (ActionIsUpdate && props.InitialVacationData) {
        setFormStatus("loading");
        axios
          .patch(
            Api(`employee/vacation-day/${props.InitialVacationData.id}`),

            StateToCreateDto(vacationForm, yearId)
          )
          .then((res) => {
            setFormStatus("none");
            console.log(res);
            props.onClose();
            props.setTableDate();
            props.openToaster({
              severity: "success",
              message: "تم تعديل الاجازة بنجاح",
            });
          })
          .catch((err) => {
            setFormStatus("error");
            console.log(err);
          });
      } else {
        setFormStatus("loading");
        axios
          .post(
            Api("employee/vacation-day"),
            StateToCreateDto(vacationForm, yearId)
          )
          .then((res) => {
            setFormStatus("none");
            console.log(res);
            props.onClose();
            props.setTableDate();
            props.openToaster({
              severity: "success",
              message: "تم حفظ الاجازة بنجاح",
            });
          })
          .catch((err) => {
            setFormStatus("error");
            console.log(err);
          });
      }
    }
  };
  const disabledInToDate = (date: dayjs.Dayjs | null) => {
    // Disable dates after the selected date
    if (date) {
      const dateFrom = dayjs(vacationForm.date_from);
      return date.isBefore(dateFrom) || date.isSame(dateFrom);
      // || date.year() !== 2022;
    }
    return false;
  };
  const disabledInFromDate = (date: dayjs.Dayjs | null) => {
    // Disable dates after the selected date
    if (date) {
      const dateTo = dayjs(vacationForm.date_to);
      return date.isAfter(dateTo) || date.isSame(dateTo);
      // || date.year() !== 2022;
    }
    return false;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(vacationForm);
    setVacation();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      component={"form"}
      onSubmit={handleFormSubmit}
      maxWidth="md"
      fullWidth
    >
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        sx={{
          borderRadius: "10px",
          border: "1px solid",
          p: 0.5,
          position: "absolute",
          top: 8,
          right: 8,
        }}
        size="large"
        color="primary"
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle sx={{ textAlign: "center" }}>{props.title}</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item md={6} p={1} px={2}>
            <Typography variant="body1" fontWeight={700} gutterBottom>
              اسم الاجازة
            </Typography>
            <TextField
              size="small"
              sx={{ width: 1 }}
              value={vacationForm.vacation_name}
              onChange={(e) =>
                dispatch({ type: "SET_VACATION_NAME", payload: e.target.value })
              }
            />
          </Grid>

          <Grid item md={6} p={1} px={2}>
            <Typography
              variant="body1"
              color={"text.disabled"}
              fontWeight={700}
              gutterBottom
            >
              عدد الايام
            </Typography>
            <TextField
              size="small"
              sx={{ width: 1 }}
              value={toShow}
              disabled
              onChange={(e) =>
                dispatch({
                  type: "SET_NUMBER_DAYS",
                  payload: Number(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item md={6} p={1} px={2}>
            <Typography variant="body1" fontWeight={700} gutterBottom>
              التاريخ من
            </Typography>
            <DatePicker
              shouldDisableDate={disabledInFromDate}
              slotProps={{
                textField: {
                  size: "small",
                  error: !isValidDateRange && !!vacationForm.date_from,
                },
              }}
              label="التاريخ من"
              sx={{ width: 1 }}
              value={
                vacationForm.date_from ? dayjs(vacationForm.date_from) : null
              }
              onChange={(newValue) =>
                newValue &&
                newValue.format &&
                dispatch({
                  type: "SET_DATE_FROM",
                  payload: newValue?.format(DateFormatString) || "",
                })
              }
            />
          </Grid>

          <Grid item md={6} p={1} px={2}>
            <Typography variant="body1" fontWeight={700} gutterBottom>
              التاريخ الى
            </Typography>
            <DatePicker
              shouldDisableDate={disabledInToDate}
              label="التاريخ الى"
              sx={{ width: 1 }}
              slotProps={{
                textField: {
                  size: "small",
                  error: !isValidDateRange && !!vacationForm.date_to,
                },
              }}
              value={vacationForm.date_to ? dayjs(vacationForm.date_to) : null}
              onChange={(newValue) =>
                newValue &&
                newValue.format &&
                dispatch({
                  type: "SET_DATE_TO",
                  payload: newValue?.format(DateFormatString) || "",
                })
              }
            />
          </Grid>

          <Grid item md={12} p={1} px={2}>
            name
            <Typography variant="body1" fontWeight={700} gutterBottom>
              اضافة موظفين لا تنطبق عليهم*
            </Typography>
            <Select
              fullWidth
              variant="outlined"
              size="small"
              multiple
              multiline
              value={vacationForm.exception_employees}
              onChange={(e) => {
                const values = e.target.value;
                Array.isArray(values) &&
                  dispatch({ type: "SET_EMPLOYEES", payload: values });
              }}
              renderValue={(selected) => {
                const selectedNames = vacationForm.exception_employees.map(
                  (id) => {
                    const selectedOption = props.employeesInBranch?.find(
                      (employee) => employee.id === id
                    );
                    return selectedOption;
                  }
                );
                return selectedNames.map((chip) => (
                  <Chip
                    key={chip?.id}
                    size="small"
                    label={chip?.name}
                    sx={{ ml: 1 }}
                  />
                ));
              }}
            >
              {props.employeesInBranch?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <LoadingButton
        loading={formStatus === "loading"}
        variant="contained"
        type="submit"
        disabled={!isValidDateRange}
        sx={{
          mb: 4,
          width: "fit-content",
          alignSelf: "center",
          px: 5,
          py: 1,
        }}
      >
        حفظ
      </LoadingButton>
    </Dialog>
  );
};

type PropsType = {
  open: boolean;
  InitialVacationData?: Vacation;
  onClose: () => void;
  title: string;
  employeesInBranch?: EmployeeType[] | undefined;
  setTableDate: () => void;
  openToaster: (partial: Partial<ToasterType>) => void;
};

export default PopupVacations;
