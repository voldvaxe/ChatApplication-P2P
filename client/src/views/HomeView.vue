<template>
  <div class="home">
    <v-container class="my-10">
      <v-card class="mx-auto" elevation="4">
        <v-row>
          <v-col cols="12" class="mt-4 px-5">
            <div class="d-flex justify-space-between">
              <v-avatar size="50px">
                <v-img
                  alt="Avatar"
                  v-if="$store.state.info.image !== undefined"
                  :src="URL + $store.state.info.image"
                ></v-img>
              </v-avatar>
              <v-btn
                class="d-inline-block"
                color="error"
                variant="outlined"
                @click="logout"
              >
                Logout
              </v-btn>
            </div>
          </v-col>
          <v-divider thickness="2"></v-divider>
          <v-col cols="3">
            <!-------------------------------------------------------->
            <v-card height="500px" class="overflow-auto">
              <v-list mandatory>
                <v-list-item
                  v-for="(user, i) in users.filter((user) => {
                    return user._id !== $store.state.info._id;
                  })"
                  :key="i"
                  active-color="#F0F2F5"
                  elevation="0"
                  variant="elevated"
                  :value="user"
                  @click="userClicked(user._id)"
                >
                  <v-list-item-avatar start>
                    <v-avatar size="50px">
                      <v-img alt="Avatar" :src="URL + user.image"></v-img>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-title
                    v-text="user.firstName + ' ' + user.lastName"
                  ></v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
            <!-------------------------------------------------------->
          </v-col>
          <v-col cols="9">
            <div>
              <v-card height="380px" class="overflow-auto">
                <v-list-item v-for="(message, i) in messages" :key="i">
                  <v-list-item-header>
                    <v-list-item-title>{{ message }}</v-list-item-title>
                  </v-list-item-header>
                </v-list-item>
              </v-card>

              <v-text-field
                v-model="messageToSend"
                label="type a message"
              ></v-text-field>
              <v-btn @click="sendMessage" class="mt-n7" color="#F0F2F5" block>
                Send a message
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import store from "@/store";
import axios from "axios";

export default {
  name: "HomeView",
  components: {},
  data: () => ({
    URL: import.meta.env.VITE_APP_BASE_URL,
    users: [],
    messages: [],
    selectedUser: "",
    messageToSend: "",
    storedMessages: {},
  }),
  computed: {
    emails() {
      return store.state.emails;
    },
    token() {
      return store.state.token;
    },
  },
  methods: {
    async logout() {
      await axios.get("user/logout", { withCredentials: true });

      localStorage.removeItem("firstLogin");
      this.$router.push({ name: "signIn" });
    },
    userClicked(id) {
      this.selectedUser = id;
      if(!this.storedMessages[id])
        this.storedMessages[id] = [];
      this.messages = this.storedMessages[id];
    },
    sendMessage() {
      this.$socket.emit("sendMessage", {
        accesstoken: "Bearer " + store.state.token,
        receiverId: this.selectedUser,
        text: this.messageToSend,
      });
      if(!this.storedMessages[this.selectedUser])
        this.storedMessages[this.selectedUser] = [];
      this.storedMessages[this.selectedUser].push('You: ' + this.messageToSend);
      this.messageToSend = "";
    },
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    getUsers: function (users) {
      this.users = users;
    },
    getMessage: function (message) {
      if(!this.storedMessages[message.senderId])
        this.storedMessages[message.senderId] = [];
      this.storedMessages[message.senderId].push('Sender: ' + message.text);
    },
  },
  watch: {
    token() {
      this.$socket.emit("addUser", "Bearer " + store.state.token);
    },
  },
  beforeCreate(){
      const firstLogin = localStorage.getItem('firstLogin')
      if(!firstLogin) this.$router.push({ name: 'signIn' })
    }
};
</script> 
