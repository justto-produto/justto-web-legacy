FILE_PATH=src/constants/iconsList.js
PREFIX="'"
SUFFIX="',"

ls src/assets/icons/*.svg > ${FILE_PATH}

for i in src/assets/icons/*.svg
do
  new_list="${new_list}\n\t${PREFIX}${i}${SUFFIX}"
done

echo ${new_list} > ${FILE_PATH}

sed -i "1 i const listIcons = [" ${FILE_PATH}
echo "]\n\nexport default listIcons" >> ${FILE_PATH}

npm run lint ${FILE_PATH} --fix
