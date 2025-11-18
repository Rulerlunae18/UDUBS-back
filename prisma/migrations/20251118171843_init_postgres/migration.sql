-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "title" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealUser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT 'user@center.local',
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'RESEARCHER',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMP(3),
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,

    CONSTRAINT "RealUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProfile" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "username" TEXT,
    "platform" TEXT,
    "system_lang" TEXT,
    "ip" TEXT,
    "city" TEXT,
    "country" TEXT,
    "session_time" INTEGER DEFAULT 0,
    "total_playtime" INTEGER DEFAULT 0,
    "safe_mode" BOOLEAN DEFAULT false,
    "opened_game" BOOLEAN DEFAULT false,
    "first_playthrough_done" BOOLEAN DEFAULT false,
    "silvair_rickroll" BOOLEAN DEFAULT false,
    "scarlett_taunts" BOOLEAN DEFAULT false,
    "kassi_named" BOOLEAN DEFAULT false,
    "kassi_said" BOOLEAN DEFAULT false,
    "kassi_1" BOOLEAN DEFAULT false,
    "kassi_2" BOOLEAN DEFAULT false,
    "kassi_3" BOOLEAN DEFAULT false,
    "kassi_4" BOOLEAN DEFAULT false,
    "collected_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "last_online" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "realUserId" INTEGER,

    CONSTRAINT "GameProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FakeUser" (
    "id" SERIAL NOT NULL,
    "codename" TEXT NOT NULL,
    "rank" TEXT,
    "clearance" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "FakeUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImage" TEXT,
    "fileType" TEXT,
    "coverCaption" TEXT,
    "stamp" TEXT,
    "clearance" TEXT,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fakeAuthorId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "View" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FakeApplication" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FakeApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RealUser_password_key" ON "RealUser"("password");

-- CreateIndex
CREATE UNIQUE INDEX "GameProfile_playerId_key" ON "GameProfile"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "FakeUser_userId_key" ON "FakeUser"("userId");

-- AddForeignKey
ALTER TABLE "RealUser" ADD CONSTRAINT "RealUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_realUserId_fkey" FOREIGN KEY ("realUserId") REFERENCES "RealUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FakeUser" ADD CONSTRAINT "FakeUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_fakeAuthorId_fkey" FOREIGN KEY ("fakeAuthorId") REFERENCES "FakeUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
