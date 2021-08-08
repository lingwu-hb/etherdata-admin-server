import { GetStaticProps } from "next";
import {
  Button,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@material-ui/core";
import { Formik } from "formik";
import Spacer from "../components/Spacer";
import { realmApp } from "./_app";
import * as Realm from "realm-web";
import { router } from "next/client";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { UIProviderContext } from "./model/UIProvider";

interface Props {}

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
      <Grid
        xs={8}
        style={{
          backgroundColor: "white",
          height: "100vh",
          background: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <Grid xs={4}>
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
              <form
                onSubmit={async (e) => {
                  setSubmitting(true);
                  await handleSubmit(e);
                  setSubmitting(false);
                }}
              >
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

                  <Button variant={"contained"} type={"submit"}>
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
