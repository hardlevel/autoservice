SELECT
  upper(sAMAccountName) AS id_usuario,
  Upper(Name) AS nome_usuario,
  upper(adsPAth) AS path
FROM
  openquery(
    ADSI,
    'select  adsPath, department , sAMAccountName, sAMAccountType,  Name , SN , ST from ''LDAP://ANDROMEDA'' where ObjectClass = ''user'' '
  )
WHERE
  sAMAccountType <> 805306369;