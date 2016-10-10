// Type definitions - discord.js 8.0.0
// (https://github.com/hydrabolt/discord.js)
// This definition file by: Nicholas Tay <nexerq@gmail.com> (https://github.com/nicholastay)
// License: ISC

declare module 'discord.js' {
    import * as events from 'events';
    import { Readable as ReadableStream } from 'stream';
    
    export class Client extends events.EventEmitter {
        // Properties
        users: Cache<User>;
        channels: Cache<ServerChannel>;
        privateChannels: Cache<PMChannel>;
        friends: Cache<User>;
        incomingFriendRequests: Cache<User>;
        outgoingFriendRequests: Cache<User>;
        servers: Cache<Server>;
        unavailableServers: Cache<Server>;
        voiceConnections: Cache<VoiceConnection>;
        readyTime: number;
        uptime: number;
        user: User;
        userAgent: { url: string, version: string, full: string };
        voiceConnection: VoiceConnection;
        
        // Constructor
        constructor(parameters?: Client_Parameters);
        
        // Class functions
        login(email: string, password: string, callback?: (error: Error, token: string) => void): Promise<string>;
        loginWithToken(token: string, email?: string, password?: string, callback?: (error: Error, token: string) => void): Promise<string>;
        logout(callback?: (error: Error) => void): Promise<void>;
        destroy(callback?: (error: Error) => void): Promise<void>;
        sendMessage(channel: ChannelResolvable, content?: StringResolvable, options?: { tts?: boolean, file?: { file: FileResolvable, name?: string, disableEveryone?: boolean } }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        sendTTSMessage(channel: ChannelResolvable, content: StringResolvable, callback?: (error: Error, message: Message) => void): Promise<Message>;
        sendFile(channel: ChannelResolvable, attachment: FileResolvable, name?: string, content?: string, callback?: (error: Error, message: Message) => void): Promise<Message>;
        reply(message: Message, content?: StringResolvable, options?: { tts: boolean }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        replyTTS(message: Message, content?: StringResolvable, callback?: (error: Error, message: Message) => void): Promise<Message>;
        awaitResponse(message: Message, prompt: StringResolvable, options?: { tts: boolean }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        updateMessage(message: Message, content: StringResolvable, options?: { tts: boolean }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        deleteMessage(message: Message, options?: { wait: number }, callback?: (error: Error) => void): Promise<void>;
        deleteMessages(messages: Message[], callback?: (error: Error) => void): Promise<void>;
        getChannelLogs(channel: Channel, limit: number, options?: { before: Message, after: Message }, callback?: (error: Error, messages: Message[]) => void): Promise<Message[]>;
        getBans(server: Server, callback?: (error: Error, users: User[]) => void): Promise<User[]>;
        joinServer(invite: InviteIDResolvable, callback?: (error: Error, server: Server) => void): Promise<Server>;
        createServer(name: string, region: AvailableRegions, callback?: (error: Error, server: Server) => void): Promise<Server>;
        updateServer(server: Server, options: Server_OptionsStructure, callback?: (error: Error) => void): Promise<void>;
        deleteServer(server: Server, callback?: (error: Error) => void): Promise<void>;
        leaveServer(server: Server, callback?: (error: Error) => void): Promise<void>;
        createChannel(server: ServerResolvable, name: string, type?: 'text' | 'voice', callback?: (error: Error, channel: ServerChannel) => void): Promise<ServerChannel>;
        deleteChannel(channel: ChannelResolvable, callback?: (error: Error) => void): Promise<void>;
        banMember(user: UserResolvable, server: ServerResolvable, length: number, callback?: (error: Error) => void): Promise<void>;
        unbanMember(user: UserResolvable, server: ServerResolvable, callback?: (error: Error) => void): Promise<void>;
        kickMember(user: UserResolvable, server: ServerResolvable, callback?: (error: Error) => void): Promise<void>;
        moveMember(user: UserResolvable, server: ServerResolvable, callback?: (error: Error) => void): Promise<void>;
        createInvite(channel: ChannelResolvable | Server, options: { maxAge?: number, maxUses?: number, temporary?: boolean, xkcd?: boolean }, callback?: (error: Error, invite: Invite) => void): Promise<Invite>;
        getInvite(invite: InviteIDResolvable, callback?: (error: Error, invite: Invite) => void): Promise<Invite>;
        getInvites(source: ChannelResolvable | ServerResolvable, callback?: (error: Error, invite: Invite[]) => void): Promise<Invite[]>;
        deleteInvite(invite: InviteIDResolvable, callback?: (error: Error) => void): Promise<void>;
        setStatus(status: 'online' | 'here' | 'active' | 'available' | 'idle' | 'away', game?: string, callback?: (error: Error) => void): Promise<void>;
        setStatusIdle(callback?: (error: Error) => void): Promise<void>;
        setStatusAway(callback?: (error: Error) => void): Promise<void>;
        setStatusOnline(callback?: (error: Error) => void): Promise<void>;
        setStatusHere(callback?: (error: Error) => void): Promise<void>;
        setStatusActive(callback?: (error: Error) => void): Promise<void>;
        setStatusAvailable(callback?: (error: Error) => void): Promise<void>;
        setPlayingGame(game: string, callback?: (error: Error) => void): Promise<void>;
        setStreaming(name: string, url: string, type: number, callback?: (error: Error) => void): Promise<void>;
        setChannelTopic(channel: ChannelResolvable, topic: string, callback?: (error: Error) => void): Promise<void>;
        setChannelName(channel: ChannelResolvable, name: string, callback?: (error: Error) => void): Promise<void>;
        setChannelNameAndTopic(channel: ChannelResolvable, name: string, topic: string, callback?: (error: Error) => void): Promise<void>;
        setChannelPosition(channel: ChannelResolvable, position?: number, callback?: (error: Error) => void): Promise<void>;
        setChannelUserLimit(channel: ChannelResolvable, limit: number, callback?: (error: Error) => void): Promise<void>;
        setChannelBitrate(channel: ChannelResolvable, bitrate: number, callback?: (error: Error) => void): Promise<void>;
        updateChannel(channel: ChannelResolvable, details: { name?: string, topic?: string, position?: number, userLimit?: number, bitrate?: number }, callback?: (error: Error) => void): Promise<void>;
        startTyping(channel: ChannelResolvable, callback?: (error: Error) => void): Promise<void>;
        stopTyping(channel: ChannelResolvable, callback?: (error: Error) => void): Promise<void>;
        updateDetails(details: { avatar?: Base64Resolvable, email?: string, newPassword?: string, username?: string }, callback?: (error: Error) => void): Promise<void>;
        setAvatar(avatar: Base64Resolvable, callback?: (error: Error) => void): Promise<void>;
        setUsername(username: string, callback?: (error: Error) => void): Promise<void>;
        joinVoiceChannel(channel: VoiceChannelResolvable, callback?: (error: Error, connection: VoiceConnection) => void): Promise<VoiceConnection>;
        leaveVoiceChannel(channel: VoiceChannelResolvable | VoiceConnection, callback?: (error: Error, connection: VoiceConnection) => void): Promise<VoiceConnection>;
        createRole(server: ServerResolvable, data?: Role_OptionsStructure, callback?: (error: Error, role: Role) => void): Promise<Role>;
        updateRole(role: Role, data: Role_OptionsStructure, callback?: (error: Error, role: Role) => void): Promise<Role>;
        deleteRole(role: Role, callback?: (error: Error) => void): Promise<void>;
        addMemberToRole(member: UserResolvable, role: RoleResolvable | RoleResolvable[], callback?: (error: Error) => void): Promise<void>;
        addUserToRole(member: UserResolvable, role: RoleResolvable | RoleResolvable[], callback?: (error: Error) => void): Promise<void>;
        memberHasRole(member: UserResolvable, role: RoleResolvable | RoleResolvable[]): boolean;
        userHasRole(member: UserResolvable, role: RoleResolvable | RoleResolvable[]): boolean;
        removeMemberFromRole(member: UserResolvable, role: RoleResolvable | RoleResolvable[], callback?: (error: Error) => void): Promise<void>;
        removeUserFromRole(member: UserResolvable, role: RoleResolvable | RoleResolvable[], callback?: (error: Error) => void): Promise<void>;
        overwritePermissions(channel: ChannelResolvable, roleOrUser: Role | User, options: { [key: string]: boolean }, callback?: (error: Error) => void): Promise<void>;
        muteMember(user: UserResolvable, server: ServerResolvable, callback?: (error: Error) => void): Promise<void>;
        unmuteMember(user: UserResolvable, server: ServerResolvable, callback?: (error: Error) => void): Promise<void>;
        deafenMember(user: UserResolvable, server: ServerResolvable, callback?: (error: Error) => void): Promise<void>;
        undeafenMember(user: UserResolvable, server: ServerResolvable, callback?: (error: Error) => void): Promise<void>;
        setNickname(server: ServerResolvable, nickname: string, user?: UserResolvable, callback?: (error: Error) => void): Promise<void>;
        
        // Events
        on(event: 'ready', listener: Function): this;
        on(event: 'disconnected', listener: Function): this;
        on(event: 'error', listener: (e: Error) => void): this;
        on(event: 'debug', listener: (m: string) => void): this;
        on(event: 'warn', listener: Function): this;
        on(event: 'raw', listener: (raw: Object) => void): this;
        on(event: 'message', listener: (message: Message) => void): this;
        on(event: 'messageDeleted', listener: (message: Message, channel: Channel) => void): this;
        on(event: 'messageUpdated', listener: (oldMessage: Message, newMessage: Message) => void): this;
        on(event: 'serverCreated', listener: (server: Server) => void): this;
        on(event: 'serverDeleted', listener: (server: Server) => void): this;
        on(event: 'serverUpdated', listener: (oldServer: Server, newServer: Server) => void): this;
        on(event: 'channelCreated', listener: (channel: Channel) => void): this;
        on(event: 'channelDeleted', listener: (channel: Channel) => void): this;
        on(event: 'serverRoleCreated', listener: (role: Role) => void): this;
        on(event: 'serverRoleDeleted', listener: (role: Role) => void): this;
        on(event: 'serverRoleUpdated', listener: (oldRole: Role, newRole: Role) => void): this;
        on(event: 'serverNewMember', listener: (server: Server, user: User) => void): this;
        on(event: 'serverMemberRemoved', listener: (server: Server, user: User) => void): this;
        on(event: 'serverMemberUpdated', listener: (server: Server, oldUser: User, newUser: User) => void): this;
        on(event: 'presence', listener: (oldUser: User, newUser: User) => void): this;
        on(event: 'userTypingStarted', listener: (user: User, channel: Channel) => void): this;
        on(event: 'userTypingStopped', listener: (user: User, channel: Channel) => void): this;
        on(event: 'userBanned', listener: (user: User, server: Server) => void): this;
        on(event: 'userUnbanned', listener: (user: User, server: Server) => void): this;
        on(event: 'voiceJoin', listener: (voiceChannel: VoiceChannel, user: User) => void): this;
        on(event: 'voiceSwitch', listener: (voiceChannel: VoiceChannel, user: User) => void): this;
        on(event: 'voiceLeave', listener: (oldVoiceChannel: VoiceChannel, newVoiceChannel: VoiceChannel, user: User) => void): this;
        on(event: 'voiceStateUpdate', listener: (voiceChannel: VoiceChannel, user: User, oldVoiceProperties: User_VoiceProperties, newVoiceProperties: User_VoiceProperties) => void): this;
        on(event: string, listener: Function): this;
    }
    
    export interface Client_Parameters {
        autoReconnect?: boolean;
        compress?: boolean;
        forceFetchUsers?: boolean;
        guildCreateTimeout?: number;
        largeThreshold?: number;
        maxCachedMessages?: number;
        rateLimitAsError?: boolean;
        disableEveryone?: boolean;
        shardCount?: number;
        shardId?: number;
    }
    
    export interface Server_OptionsStructure {
        name?: string,
        region?: AvailableRegions,
        ownerID?: UserResolvable,
        icon?: Base64Resolvable,
        splash?: Base64Resolvable,
        verificationLevel?: number,
        afkChannelID?: ChannelResolvable,
        afkTimeout?: number 
    }
    
    export interface Role_OptionsStructure {
        color?: number,
        hoist?: boolean,
        name?: string,
        permissions?: string[],
        mentionable?: boolean
    }
    
    export interface Server_UserDetails {
        joinedAt: number,
        roles: Role[],
        mute: boolean,
        selfMute: boolean,
        deaf: boolean,
        selfDeaf: boolean,
        nick: string
    }
    
    export interface User_VoiceProperties {
        mute: boolean,
        selfMute: boolean,
        deaf: boolean,
        selfDeaf: boolean
    }
    
    export interface Voice_PlayOptions {
        seek?: number,
        volume?: number | string
    }
    
    export interface Message_Attachment {
        id: string;
        url: string;
        proxy_url: string;
        filename: string;
        size: number;
        height?: number;
        width?: number;
    }
    
    export interface Message_Embed {
        url: string;
        type: string;
        title: string;
        thumbnail?: {
            url: string;
            proxy_url: string;
            height: number;
            width: number;
        }
    }
    
    class Equality {
        equals(object): boolean;
    }
    
    export class Cache<T> extends Array {
        get(key, value): T;
        getAll(key, value): Cache<T>;
        has(key, value): boolean;
        add(data): void;
        update(old, data): void;
        remove(data): void;
        random(): T;
    }
    export class User extends Equality {
        client: Client;
        username: string;
        name: string;
        discriminator: number;
        id: string;
        avatar: string;
        avatarURL: string;
        status: string;
        game: { name: string };
        typing: { since: number, channel: Channel };
        bot: boolean;
        voiceChannel: VoiceChannel;
        createdAt: Date;
        
        mention(): string;
        sendMessage(content?: StringResolvable, options?: { tts?: boolean, file?: { file: FileResolvable, name?: string, disableEveryone?: boolean } }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        sendTTSMessage(content: StringResolvable, callback?: (error: Error, message: Message) => void): Promise<Message>;    
        sendFile(attachment: FileResolvable, name?: string, content?: string, callback?: (error: Error, message: Message) => void): Promise<Message>;
        startTyping(callback?: (error: Error) => void): Promise<void>;
        stopTyping(callback?: (error: Error) => void): Promise<void>;
        addTo(role: RoleResolvable | RoleResolvable[], callback?: (error: Error) => void): Promise<void>;
        getChannelLogs(limit: number, options?: { before: Message, after: Message }, callback?: (error: Error, messages: Message[]) => void): Promise<Message[]>;
        hasRole(role: RoleResolvable | RoleResolvable[]): boolean;
    }
    export class Channel extends Equality {
        id: string;
        client: Client;
        isPrivate: boolean;
        createdAt: Date;
        
        delete(): void;
    }
    export class ServerChannel extends Channel {
        name: string;
        type: 'text' | 'voice';
        position: number;
        permissionOverwrites: Cache<PermissionOverwrite>;
        server: Server;
        
        permissionsOf(userOrRole: User | Role): ChannelPermissions;
        mention(): string;
        setName(name: string, callback?: (error: Error) => void): Promise<void>;
        setPosition(position?: number, callback?: (error: Error) => void): Promise<void>;
        update(details: { name?: string, topic?: string, position?: number, userLimit?: number, bitrate?: number }, callback?: (error: Error) => void): Promise<void>;
    }
    export class TextChannel extends ServerChannel {
        topic: string;
        lastMessage: Message;
        messages: Cache<Message>;

        setTopic(topic: string, callback?: (error: Error) => void): Promise<void>;
        setNameAndTopic(name: string, topic: string, callback?: (error: Error) => void): Promise<void>;
        send(content?: StringResolvable, options?: { tts?: boolean, file?: { file: FileResolvable, name?: string, disableEveryone?: boolean } }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        sendTTS(content: StringResolvable, callback?: (error: Error, message: Message) => void): Promise<Message>;
        sendFile(attachment: FileResolvable, name?: string, content?: string, callback?: (error: Error, message: Message) => void): Promise<Message>;
        getLogs(limit: number, options?: { before: Message, after: Message }, callback?: (error: Error, messages: Message[]) => void): Promise<Message[]>;
        startTyping(callback?: (error: Error) => void): Promise<void>;
        stopTyping(callback?: (error: Error) => void): Promise<void>;
    }
    export class PMChannel extends Channel {
        messages: Cache<Message>;
        recipient: User;
        lastMessage: Message;

        send(content?: StringResolvable, options?: { tts?: boolean, file?: { file: FileResolvable, name?: string, disableEveryone?: boolean } }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        sendTTS(content: StringResolvable, callback?: (error: Error, message: Message) => void): Promise<Message>;
        sendFile(attachment: FileResolvable, name?: string, content?: string, callback?: (error: Error, message: Message) => void): Promise<Message>;
        getLogs(limit: number, options?: { before: Message, after: Message }, callback?: (error: Error, messages: Message[]) => void): Promise<Message[]>;
        startTyping(callback?: (error: Error) => void): Promise<void>;
        stopTyping(callback?: (error: Error) => void): Promise<void>;
    }
    export class VoiceChannel extends ServerChannel {
        members: Cache<User>;
        userLimit: number;
        bitrate: number;
        
        setUserLimit(limit: number, callback?: (error: Error) => void): Promise<void>;
        join(callback?: (error: Error, connection: VoiceConnection) => void): Promise<VoiceConnection>;
        setUserLimit(imit: number, callback?: (error: Error) => void): Promise<void>;
        setBitrate(bitrate: number, callback?: (error: Error) => void): Promise<void>;

    }
    export class Server extends Equality {
        client: Client;
        region: string;
        name: string;
        id: string;
        members: Cache<User>;
        channels: Cache<ServerChannel>;
        roles: Cache<Role>;
        icon: string;
        iconURL: string;
        afkTimeout: number;
        afkChannel: ServerChannel;
        defaultChannel: ServerChannel;
        generalChannel: ServerChannel;
        general: ServerChannel;
        owner: User;
        createdAt: Date;
        
        rolesOfUser(user: User): Role[];
        rolesOf(user: User): Role[];
        rolesOfMember(user: User): Role[];
        usersWithRole(role: Role): User[];
        membersWithRole(role: Role): User[];
        detailsOfUser(user: User): Server_UserDetails;
        detailsOf(user: User): Server_UserDetails;
        detailsOfMember(user: User): Server_UserDetails;
        
        // shortcuts
        leave(callback?: (error: Error) => void): Promise<void>;
        delete(server: Server, callback?: (error: Error) => void): Promise<void>;
        createInvite(options: { maxAge?: number, maxUses?: number, temporary?: boolean, xkcd?: boolean }, callback?: (error: Error, invite: Invite) => void): Promise<Invite>;
        createRole(data?: Role_OptionsStructure, callback?: (error: Error, role: Role) => void): Promise<Role>;
        createChannel(name: string, type?: 'text' | 'voice', callback?: (error: Error, channel: ServerChannel) => void): Promise<ServerChannel>;
        getBans(callback?: (error: Error, users: User[]) => void): Promise<User[]>;
        banMember(user: UserResolvable, length: number, callback?: (error: Error) => void): Promise<void>;
        unbanMember(user: UserResolvable, callback?: (error: Error) => void): Promise<void>;
        kickMember(user: UserResolvable, callback?: (error: Error) => void): Promise<void>;
        setNickname(nickname: string, user?: UserResolvable, callback?: (error: Error) => void): Promise<void>;
    }
    export class Message extends Equality {
        id: string;
        channel: TextChannel | PMChannel;
        server: Server;
        client: Client;
        attachments: Message_Attachment[];
        tts: boolean;
        embeds: Message_Embed[];
        timestamp: number;
        everyoneMentioned: boolean;
        editedTimestamp: number;
        author: User;
        sender: User;
        content: string;
        cleanContent: string;
        mentions: User[];
        
        isMentioned(user: User): boolean;
        delete(options?: { wait: number }, callback?: (error: Error) => void): Promise<void>;
        update(content: StringResolvable, options?: { tts: boolean }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        reply(content?: StringResolvable, options?: { tts: boolean }, callback?: (error: Error, message: Message) => void): Promise<Message>;
        replyTTS(content?: StringResolvable, callback?: (error: Error, message: Message) => void): Promise<Message>;
    }
    export class Invite {
        maxAge: number;
        code: string;
        server: Server;
        channel: ServerChannel;
        revoked: boolean;
        createdAt: number;
        temporary: boolean;
        uses: number;
        maxUses: number;
        inviter: User;
        xkcd: boolean;

        toString(): string;
        delete(callback?: (error: Error) => void): Promise<void>;
        join(invite: InviteIDResolvable, callback?: (error: Error, server: Server) => void): Promise<Server>;
    }
    export class Role {
        id: string;
        name: string;
        position: number;
        managed: boolean;
        hoist: boolean;
        color: number;
        server: Server;
        client: Client;
        createAt: Date;
        
        serialise(): { [key: string]: boolean };
        serialize(): { [key: string]: boolean };
        hasPermission(permission: string): boolean;
        setPermission(permission: string, value: boolean);
        setPermissions(object: Object);
        delete(callback?: (error: Error) => void): Promise<void>;
        update(data: Role_OptionsStructure, callback?: (error: Error, role: Role) => void): Promise<Role>;
        addMember(member: UserResolvable, callback?: (error: Error) => void): Promise<void>;
        removeMember(member: UserResolvable, callback?: (error: Error) =>void): Promise<void>;
        colorAsHex(): string;
        mention(): string;
    }
    export class ChannelPermissions {
        serialise(): { [key: string]: boolean };
        serialize(): { [key: string]: boolean };
        hasPermission(permission: string, explicit: boolean): boolean;
    }
    export class PermissionOverwrite {
        id: string;
        type: 'member' | 'role';
        allowed: string[];
        denied: string[];

        setAllowed(allowedArray: string[]);
        setDenied(deniedArray: string[]);
    }
    export class VoiceConnection extends events.EventEmitter {
        id: string;
        voiceChannel: VoiceChannel;
        client: Client;
        token: string;
        server: Server;
        // encoder: AudioEncoder; i have no idea why you would care, so ill just any this
        encoder: any
        playingIntent: StreamIntent;
        playing: boolean;
        streamTime: number;
        paused: boolean;
        
        playFile(path: string, options?: Voice_PlayOptions, callback?: (error: Error, intent: StreamIntent) => void): Promise<StreamIntent>;
        playRawStream(stream: ReadableStream, options?: Voice_PlayOptions, callback?: (error: Error, intent: StreamIntent) => void): Promise<StreamIntent>;
        playArbitraryFFmpeg(ffmpegOptions: string[], volume?: number | string, callback?: (error: Error, intent: StreamIntent) => void): Promise<StreamIntent>;
        
        setSpeaking(value: boolean): void;
        setVolume(volume: number): void;
        getVolume(): number;
        mute(): void;
        unmute(): void;
        pause(): void;
        resume(): void;
        stopPlaying(): void;
        destroy(): void;
        
        on(event: 'ready', listener: Function): this;
        on(event: 'close', listener: Function): this;
        on(event: 'error', listener: (error: Error, message: string) => void): this;
        on(event: 'debug', listener: (m: string) => void): this;
        on(event: string, listener: Function): this;
    }
    // export class AudioEncoder {}
    export class StreamIntent extends events.EventEmitter {
        on(event: 'end', listener: Function): this;
        on(event: 'time', listener: (streamTime: number) => void): this;
        on(event: 'error', listener: (error: Error) => void): this;
        on(event: 'resume', listener: Function): this;
        on(event: 'pause', listener: Function): this;
        on(event: string, listener: Function): this;
    }
    
    type ChannelResolvable = Channel | Server | Message | User | string;
    type VoiceChannelResolvable = VoiceChannel | string;
    type ServerResolvable = Server | ServerChannel | Message | string;
    type FileResolvable = ReadableStream | string;
    type RoleResolvable = Role | string;
    type StringResolvable = any[] | string;
    type UserResolvable = User | Message | TextChannel | PMChannel | Server | string;
    type Base64Resolvable = Buffer | string;
    type InviteIDResolvable = Invite | string;
    type AvailableRegions = 'us-west' | 'us-east' | 'us-south' | 'us-central' | 'singapore' | 'london' | 'sydney' | 'frankfurt' | 'amsterdam';
}
