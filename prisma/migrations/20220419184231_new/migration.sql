-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlists" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "Playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Music" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MusicToPlaylists" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "Users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_userId_key" ON "Users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_MusicToPlaylists_AB_unique" ON "_MusicToPlaylists"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicToPlaylists_B_index" ON "_MusicToPlaylists"("B");

-- AddForeignKey
ALTER TABLE "Playlists" ADD CONSTRAINT "Playlists_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MusicToPlaylists" ADD FOREIGN KEY ("A") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MusicToPlaylists" ADD FOREIGN KEY ("B") REFERENCES "Playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
