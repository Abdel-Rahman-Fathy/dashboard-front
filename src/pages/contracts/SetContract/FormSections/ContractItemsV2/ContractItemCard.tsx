import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ContractItem } from "../../../../../types/Contracts/ContractItems";
import dayjs from "dayjs";
import { Avatar } from "@mui/material";

function ContractItemCard({ data, selectItemToEdit }: PropsType) {
  const startDate = data.start_date
    ? dayjs(data.start_date).format("YYYY-MM-DD")
    : undefined;
  const endDate = data.end_date
    ? dayjs(data.end_date).format("YYYY-MM-DD")
    : undefined;

  return (
    <Card
      sx={{
        width: 1,
        height: 1,
        bgcolor: "Background",
        display: "flex",
        flexDirection: "column",
      }}
      elevation={1}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography>{data.name}</Typography>
        <Typography color="text.secondary">
          {startDate} - {endDate}
        </Typography>
        {data.manager && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Avatar alt={data.manager.name} />
            <Typography variant="body1" color="secondary.main">
              {data.manager.name}
            </Typography>
          </Box>
        )}
        <Typography variant="h5"></Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => selectItemToEdit(data.id)}>
          تعديل
        </Button>
      </CardActions>
    </Card>
  );
}

type PropsType = { data: ContractItem; selectItemToEdit: (id: number) => void };

export default ContractItemCard;
