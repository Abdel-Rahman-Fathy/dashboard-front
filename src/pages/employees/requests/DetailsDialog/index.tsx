import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Stack,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { EmployeeRequest } from "../../../../types";
import { useEffect, useState } from "react";
import { RequestDetails } from "../../../../types/RequestDetails";
import axios from "axios";
import { Api } from "../../../../constants";
import { objectToArrayWithArName } from "../../../../methods/objToArrWithAr";

function DetailsDialog(props: PropsType) {
  const [details, setDetails] = useState<RequestDetails | undefined>(undefined);

  useEffect(() => {
    if (props.open && props.requestId > 0) {
      setDetails(undefined);
      axios
        .get<{ request: RequestDetails }>(
          Api(`employee/general-requests/requests/${props.requestId}`)
        )
        .then(({ data }) => {
          setDetails(data.request);
        });
    }
  }, [props.open]);

  const detailsWithAr = details ? objectToArrayWithArName(details) : [];

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <DialogTitle>نوع الطلب</DialogTitle>
      <DialogContent>
        <Grid container>
          {
            <Grid item md={6} p={1} px={2}>
              <Typography variant="body1" fontWeight={700} gutterBottom>
                اسم الموظف
              </Typography>
              <TextField
                value={details?.employee?.name || ""}
                disabled
                fullWidth
                size="small"
              />
            </Grid>
          }
          {detailsWithAr.map(
            (item) =>
              (typeof item.value === "string" ||
                typeof item.value === "number") && (
                <Grid item md={6} p={1} px={2}>
                  <Typography variant="body1" fontWeight={700} gutterBottom>
                    {item.name}
                  </Typography>
                  <TextField
                    value={item.value}
                    disabled
                    fullWidth
                    size="small"
                  />
                </Grid>
              )
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

type PropsType = {
  open: boolean;
  requestId: number;
  onClose: () => void;
};

export default DetailsDialog;
