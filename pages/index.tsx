import {
  Button,
  Grid,
  Hidden,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import Spacer from "../components/common/Spacer";
import { realmApp } from "./_app";
import * as Realm from "realm-web";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { UIProviderContext } from "./model/UIProvider";

interface Props {}

/**
 * Home page
 * @param props
 * @constructor
 */
export default function Home(props: Props) {
  const router = useRouter();
  const { showSnackBarMessage } = React.useContext(UIProviderContext);

  React.useEffect(() => {
    if (realmApp.currentUser !== null) {
      router.push("/home");
    }
  }, []);

  return (
    <Grid container>
      <Hidden only={"xs"}>
        <Grid
          item
          xs={8}
          style={{
            backgroundColor: "white",
            height: "100vh",
            background: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Hidden>
      <Grid item xs={12} md={4}>
        <Stack
          justifyContent={"center"}
          alignContent={"center"}
          style={{ height: "100vh", padding: 13 }}
          spacing={3}
        >
          <Typography variant={"h6"}>Login</Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async (v) => {
              try {
                const credentials = Realm.Credentials.emailPassword(
                  v.email,
                  v.password
                );
                await realmApp.logIn(credentials);
                await router.push("/home");
              } catch (e) {
                showSnackBarMessage(
                  "Cannot login. Check your password and username"
                );
              }
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              isSubmitting,
              setSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {isSubmitting && <LinearProgress />}
                  <TextField
                    variant={"standard"}
                    label={"Email"}
                    name={"email"}
                    onChange={handleChange}
                    fullWidth
                  />

                  <TextField
                    variant={"standard"}
                    label={"Password"}
                    name={"password"}
                    type={"password"}
                    onChange={handleChange}
                    fullWidth
                  />

                  <Button variant={"contained"} type={"submit"} id={"login"}>
                    Login
                  </Button>
                  <Spacer height={100} />
                </Stack>
              </form>
            )}
          </Formik>
        </Stack>
      </Grid>
    </Grid>
  );
}
