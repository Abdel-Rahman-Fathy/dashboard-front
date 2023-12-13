import { Grid, Stack, Typography, Button, TextField, Box } from "@mui/material";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusChip from "../../../../components/StatusChip";

function TableHeader() {
  return (
    <Grid container px={2} py={3}>
      <Grid item xs={2}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          حالات العقد
        </Typography>

        <StatusChip color="primary" label={0} ml={1} />
        <StatusChip color="warning" label={0} ml={1} />
        <StatusChip color="success" label={0} ml={1} />
        <StatusChip color="secondary" label={0} />
      </Grid>
      <Grid item xs={6}>
        <Stack component="form" direction="row">
          <TextField label="بحث" fullWidth size="small" />
          <Button variant="contained" type="submit">
            بحث
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={3}>
        <Box>
          <Button variant="outlined" startIcon={<DeleteIcon />}>
            حذف
          </Button>
          <Button variant="outlined" startIcon={<CreditScoreIcon />}>
            تعديل
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default TableHeader;
