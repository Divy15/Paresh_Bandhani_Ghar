-- CreateTable
CREATE TABLE "role_master" (
    "roleid" SERIAL NOT NULL,
    "rolename" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_master_pkey" PRIMARY KEY ("roleid")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "middlename" TEXT,
    "lastname" TEXT NOT NULL,
    "mobileno" TEXT NOT NULL,
    "roleid" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_master" (
    "permissionid" SERIAL NOT NULL,
    "permissionname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_master_pkey" PRIMARY KEY ("permissionid")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" SERIAL NOT NULL,
    "roleid" INTEGER NOT NULL,
    "permissionid" INTEGER NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_master_rolename_key" ON "role_master"("rolename");

-- CreateIndex
CREATE UNIQUE INDEX "user_mobileno_key" ON "user"("mobileno");

-- CreateIndex
CREATE UNIQUE INDEX "permission_master_permissionname_key" ON "permission_master"("permissionname");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_roleid_permissionid_key" ON "role_permission"("roleid", "permissionid");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "role_master"("roleid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "role_master"("roleid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permissionid_fkey" FOREIGN KEY ("permissionid") REFERENCES "permission_master"("permissionid") ON DELETE CASCADE ON UPDATE CASCADE;
